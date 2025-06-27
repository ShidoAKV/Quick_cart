import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import prisma from '@/config/db';
import { withTimeout } from '@/config/timeout';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'nodejs';


export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorised' });
    }

    const formData = await request.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice');
    const category = formData.get('category');
    const material = formData.get('material');
    const stock = formData.get('stock');
    const color=JSON.parse(formData.get('color'));
    const size = JSON.parse(formData.get('size') || '[]');
    const colorImageMapRaw = formData.get('colorImageMap');
    const colorImageMap = JSON.parse(colorImageMapRaw || '{}');
    
    const files = formData.getAll('images');

    if (!files || files.length === 0 || !size || !price || !category || !offerPrice || !stock || !colorImageMapRaw) {
      return NextResponse.json({ success: false, message: 'Missing fields or files' });
    } 
    
    const validFiles = files.filter(file => file && typeof file.arrayBuffer === 'function');
    if (validFiles.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid files uploaded' });
    }
    
    const imageUrlMap = {};

    for (const file of validFiles) {
      const filename = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        
        cloudinary.uploader.upload_stream(
          { resource_type: 'image',public_id:filename.split('.')[0] },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(buffer);
      });

      imageUrlMap[filename] = uploadResult.secure_url;
    }
  
    const finalColorImageMap = {};
  
     for (const [colorKey, filenames] of Object.entries(colorImageMap)) {
       finalColorImageMap[colorKey] = filenames?.map(filename => imageUrlMap[filename]).filter(Boolean)
    }
     // color me type stored hai
    
   
    const newProduct = await prisma.product.create({
        data: {
          userId,
          name: name || 'Untitled',
          description: description || '',
          category: category || '',
          price: Number(price),
          offerPrice: Number(offerPrice),
          image: Object.values(imageUrlMap),
          date: new Date(),
          size,
          stock: parseInt(stock),
          material: material || '',
          brand: 'Pilley',
          colorImageMap: finalColorImageMap,
          color
        },
      }
    );

     
    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      newProduct,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
