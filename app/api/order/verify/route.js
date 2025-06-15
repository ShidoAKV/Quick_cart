
import prisma from "@/config/db";
import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpayinstance.js";
import { withTimeout } from "@/config/timeout";

export async function POST(request) {
  try {
    const res = await request.json();
    const razorpay_order_id = res.razorpay_order_id;
    const razorpayPaymentId = res.razorpay_payment_id;

    if (!razorpay_order_id) {
      return NextResponse.json({ success: false, message: 'Missing required fields' });
    } 

   
    const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);

    
    if (!razorpayOrder) {
      return NextResponse.json({ success: false, message: 'Razorpay order not found' });
    }

     
    const order = await withTimeout(
    prisma.order.findUnique({
      where: { orderId: razorpayOrder.receipt },
    }),30000);

    if (!order) {
      return NextResponse.json({ success: false, message: 'No matching order found' });
    }
  

    if (razorpayOrder.status === 'paid') {
      // Update payment status in DB
      await prisma.order.update({
        where: { id: order.id },
        data: {
          payment: true,
          PaymentId: razorpayPaymentId,
        },
      });
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Payment not successful yet' });
    }
  } catch (error) {
   
    return NextResponse.json({ success: false, message: error.message });
  }
}