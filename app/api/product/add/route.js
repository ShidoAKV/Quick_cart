import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import prisma from '@/config/db';

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
    const stock=formData.get('stock');
    const size = JSON.parse(formData.get('size') || '[]');
    const color = JSON.parse(formData.get('color') || '[]');
    const files = formData.getAll('images');

    console.log(stock);
    
  

    if (!files || files.length === 0||!size||!color||!price||!category||!offerPrice||!stock) {
      return NextResponse.json({ success: false, message: 'No files uploaded' });
    }

    const validFiles = files.filter(file => file && typeof file.arrayBuffer === 'function');
    if (validFiles.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid files uploaded' });
    } 
    
    
    const uploadedImageUrls = [];

    for (const file of validFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(buffer);
      });

      uploadedImageUrls.push(uploadResult.secure_url);
    }

    const newProduct = await prisma.product.create({
      data: {
        userId,
        name: name || 'Untitled',
        description: description || '',
        category: category || '',
        price: Number(price),
        offerPrice: Number(offerPrice),
        image: uploadedImageUrls,
        date: new Date(),
        size,
        stock:parseInt(stock),
        color,
        material: material || '',
        brand: 'Pilley', // default value as in original
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      newProduct,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
} 