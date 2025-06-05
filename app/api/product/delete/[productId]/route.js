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
    await prisma.orderItem.deleteMany({ where: { productId } });

    
     const users = await prisma.user.findMany();

    for (const user of users) {
      const cart = user.cartItems || {};
      const updatedCart = {};

      let hasChanges = false;

      for (const key in cart) {
        const item = cart[key];
        if (item.productId !== productId) {
          updatedCart[key] = item;
        } else {
          hasChanges = true;
        }
      }

      if (hasChanges) {
        await prisma.user.update({
          where: { id: user.id },
          data: { cartItems: updatedCart },
        });
      }
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}