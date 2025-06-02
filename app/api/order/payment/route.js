// import connectDB from "@/config/db";
// import Address from "@/models/Address";
// import Product from "@/models/Product";
// import Order from "@/models/Order";
import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpayinstance.js";

// export async function POST(request){
//   try {
//      const { userId } = getAuth(request);
//      const {orderId}=await request.json();

//     if (!userId || !orderId) {
//       return NextResponse.json({ success: false, message: "userID or orderId missing"});
//     }
      
      
//     const order = await Order.findOne({orderId});

//     if (!order) {
//       return NextResponse.json({ success: false, message: "Order not fount"});
//     }

//     const options = {
//       amount: order.amount * 100,
//       currency: process.env.CURRENCY || 'INR',
//       receipt: `${orderId}`
//     };

//     const razorpayOrder = await razorpayInstance.orders.create(options);
    
//     if (!razorpayOrder || !razorpayOrder.id) {
//      return NextResponse.json({ success: false, message: "razorpayId missing"});
//     }
    
    
//     return NextResponse.json({ success: true,order:razorpayOrder});
//   } catch (error) {
    
//     return NextResponse.json({ success: false, message:error.message});
//   }

// }

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
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

    const options = {
      amount: Math.round(order.amount * 100), 
      currency: process.env.CURRENCY || 'INR',
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