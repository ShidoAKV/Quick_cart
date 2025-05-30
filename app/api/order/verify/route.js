import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpayinstance.js";


export async function POST(request) {
  try {
    const res= await request.json();
    const razorpay_order_id=res.razorpay_order_id;
    const razorpayPaymentId=res.razorpay_payment_id;
     
    if (!razorpay_order_id) {
      return NextResponse.json({ success: false, message: 'Missing required fields' });
    }
   
    await connectDB();

    const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
    
    if (!razorpayOrder) {
      return NextResponse.json({ success: false, message: 'Razorpay order not found' });
    }

    const order = await Order.findOne({orderId:razorpayOrder.receipt});

    if (!order) {
      return NextResponse.json({ success: false, message: 'No matching order found for user and product' });
    }

    if (razorpayOrder.status === 'paid') {
      order.payment = true;
      order.PaymentId=razorpayPaymentId;
      await order.save();
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Payment not successful yet' });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}