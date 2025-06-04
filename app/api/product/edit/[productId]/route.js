import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/config/db';


export async function POST(request, { params }) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorised' });
    }

    const { productId } =await params;
    const formData = await request.formData();

    const offerPrice = formData.get('offerPrice');
    const stock = formData.get('stock');
    const color = JSON.parse(formData.get('color') || '[]');

    if (!offerPrice || !stock || !color) {
      return NextResponse.json({ success: false, message: 'Missing fields' });
    }


    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        offerPrice: parseFloat(offerPrice),
        color: Array.isArray(color) ? color : [color],
        stock: parseInt(stock)
      },
    });

    return NextResponse.json({
      success: true,
      newProduct: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
