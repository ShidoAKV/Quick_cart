import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpayinstance";
import prisma from "@/config/db";
import { withTimeout } from "@/config/timeout";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isseller = await authSeller(userId);
    const { PaymentId,email} = await request.json();
    

    if (!isseller) {
      return NextResponse.json({ success: false, message: "Not authorized" });
    }

    const order = await withTimeout(
      prisma.order.findFirst({
        where: { PaymentId },
      }), 20000);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    if (order.refunded) {
      return NextResponse.json({ success: true, message: "Refund already marked in DB" });
    }

    const payment = await razorpayInstance.payments.fetch(PaymentId);

    const refundableAmount = payment.amount - payment.amount_refunded;

    if (refundableAmount <= 0) {
      return NextResponse.json({ success: false, message: "No refundable amount left" });
    }

    const refund = await razorpayInstance.payments.refund(PaymentId, {
      amount:payment.amount,
      receipt: `Refund-${PaymentId}`,
      notes: {
        reason: "Seller-initiated refund",
        customer_email:email 
      }
    });
   
    await prisma.order.update({
      where: { id: order.id },
      data: {
        refunded: true,
        refundId: refund.id,
        refundStatus: refund.status,
      },
    });

    return NextResponse.json({ success: true, message: "Refund successful" });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error?.error?.description || error.message || "Unknown error"
    });
  }
}
