import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpayinstance.js";

export async function POST(request) {
  try {
    const { userId } = await getAuth(request); 
    const { orderId } = await request.json();

    if (!userId || !orderId) {
      return NextResponse.json({ success: false, message: "userId or orderId missing" });
    }

    const order = await prisma.order.findUnique({
      where: { orderId }, 
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    if (!order.amount || isNaN(order.amount)) {
      return NextResponse.json({ success: false, message: "Invalid order amount" });
    }

    const options = {
      amount: Math.round(order.amount*100),
      currency: 'INR',
      receipt: orderId,
    };
   
    
    const razorpayOrder = await razorpayInstance.orders.create(options);
    
    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json({ success: false, message: "razorpayId missing" });
    }

    return NextResponse.json({ success: true, order: razorpayOrder });
  } catch (error) {
   
    return NextResponse.json({ success: false, message: error.message });
  }
}
