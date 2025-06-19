import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/config/db';
import { withTimeout } from '@/config/timeout';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request, { params }) {
  try {
    const { userId } = getAuth(request);
    if (!(await authSeller(userId))) {
      return NextResponse.json({ success: false, message: 'Not authorised' });
    }

    const { productId } =await params;
    const formData = await request.formData();

    const offerPrice = formData.get('offerPrice');
    const stock = formData.get('stock');
    const colorRaw = formData.get('color');
    const colorImageMapRaw = formData.get('colorImageMap');
    const files = formData.getAll('images');


      const hasAnyField =
      (offerPrice && offerPrice.trim() !== '') ||
      (stock && stock.trim() !== '') ||
      (colorRaw && colorRaw.trim() !== '') ||
      (colorImageMapRaw && colorImageMapRaw.trim() !== '') ||
      (files && files.length > 0);

    if (!hasAnyField) {
      return NextResponse.json({ success: false, message: 'No fields to update' });
    }

    const imageUrlMap = {};
    for (const file of files.filter(f => f && typeof f.arrayBuffer === 'function')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) =>
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', public_id: file.name.split('.')[0] },
          (err, result) => (err ? reject(err) : resolve(result))
        ).end(buffer)
      );
      imageUrlMap[file.name] = uploadResult.secure_url;
    }

    const colorImageMapFromClient = colorImageMapRaw ? JSON.parse(colorImageMapRaw) : {};
    const updatedColorImageMap = {};
    for (const [colorName, filenames] of Object.entries(colorImageMapFromClient)) {
      updatedColorImageMap[colorName] = filenames.map(name => imageUrlMap[name] || name);
    }


    const updateData = {};
    if (offerPrice && offerPrice.trim() !== '') updateData.offerPrice = parseFloat(offerPrice);
    if (stock && stock.trim() !== '') updateData.stock = parseInt(stock);
    if (colorRaw && colorRaw.trim() !== '') updateData.color = JSON.parse(colorRaw);
    if (colorImageMapRaw && colorImageMapRaw.trim() !== '') updateData.colorImageMap = updatedColorImageMap;

    const updatedProduct = await withTimeout(
      prisma.product.update({
        where: { id: productId },
        data: updateData,
      }),
      10000
    );

    return NextResponse.json({ success: true, newProduct: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
