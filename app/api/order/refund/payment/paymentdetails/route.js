import { NextResponse } from "next/server";
import prisma from "@/config/db";
import razorpayInstance from "@/lib/razorpayinstance";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return NextResponse.json({ success: false, message: "Missing orderId" });
        }

        const refund = await prisma.refund.findFirst({
            where: { orderId },
            select: {
                paymentLinkId: true,
            },
        });

        if (!refund?.paymentLinkId) {
            return NextResponse.json({ success: false, message: "No payment link found for refund" });
        }

        const paymentLink = await razorpayInstance.paymentLink.fetch(refund.paymentLinkId);

        if (paymentLink.status === "paid") {
           
            await prisma.order.update({
                where: {id:orderId},
                data: { refundFeePaid: true },
            });


            return NextResponse.json({ success: true, message: "Refund fee marked as paid" });
        }

        return NextResponse.json({ success: false, message: "Payment not completed yet" });
    } catch (error) {
        console.error("Refund payment check error:", error);
        return NextResponse.json({ success: false, message: error.message || "Something went wrong" });
    }
}
