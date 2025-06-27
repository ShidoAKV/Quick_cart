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

    const { productId } = await params;
    if (!productId) {
      return NextResponse.json({ success: false, message: 'productId is required' });
    }


    const orderItems = await prisma.orderItem.findMany({
      where: { productId },
      select: { orderId: true },
    });

    const affectedOrderIds = [...new Set(orderItems.map(item => item.orderId))];


    await prisma.product.delete({
      where: { id: productId },
    });


    for (const orderId of affectedOrderIds) {
      const remainingItems = await prisma.orderItem.count({
        where: { orderId },
      });

      if (remainingItems === 0) {
        await prisma.order.delete({
          where: { id: orderId },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product and affected orders deleted successfully',
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
