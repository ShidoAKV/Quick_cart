import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import razorpayInstance from "@/lib/razorpayinstance";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ success: false, message: "no order found" });
        }

        const refunddetails = await prisma.refund.findFirst({
            where: {
                orderId,
            },
            select: {
                name: true,
                email: true,
                paymentLinkId:true
            },
        });

        if(refunddetails?.paymentLinkId){
            return  NextResponse.json({ success: false, message: 'Already Paid' });
        }

        const paymentLink = await razorpayInstance.paymentLink.create({
            amount: 10000, // ₹100 in paise
            currency: "INR",
            accept_partial: false,
            description: "Refund processing fee",
            customer: {
                name: refunddetails.name,
                email: refunddetails.email,
            },
            notify: {
                sms: true,
                email: true,
                whatsapp: true, 
            },
            notes: {
                orderId: orderId,
                purpose: "Refund fee"
            },
            callback_url: "https://yourdomain.com/refund-callback",
            callback_method: "get"
        });

        if (!paymentLink.id) {
            return NextResponse.json({ success: false, message: 'payment link not sended to email' });
        }
       
        await prisma.refund.updateMany({
            where: { orderId },
            data: {
                paymentLinkId: paymentLink.id,
            },
        });

        return NextResponse.json({ success: true, message: 'payment link sended to email' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
