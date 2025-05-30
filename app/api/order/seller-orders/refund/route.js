import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpayinstance";


export async function POST(request) {
    try {
       const { userId } = getAuth(request);
        const isseller = await authSeller(userId);
        const { PaymentId } = await request.json();

        if (!isseller) {
            return NextResponse.json({ success: false, message: 'not authorized' })
        }
        await connectDB();
         const order = await Order.findOne({PaymentId});

        if (!order) {
            return NextResponse.json({ success:false, message:'order id not found' });
        }

        if (order.refunded) {
            return NextResponse.json({ success: true, message:'refund Already done'});
        }

        const refund =razorpayInstance.payments.refund(PaymentId);

        order.refunded = true;
        order.refundId = refund.id;
        order.refundStatus = refund.status;
        await order.save();

        return NextResponse.json({ success: true, message:'refund successfull',refund });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}