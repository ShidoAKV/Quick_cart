
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
    const { PaymentId } = await request.json();

    if (!isseller) {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    const order = await withTimeout(
    prisma.order.findFirst({
      where: {PaymentId },
    }),10000);

    if (!order) {
      return NextResponse.json({ success: false, message: "order id not found" });
    }

    if (order.refunded) {
      return NextResponse.json({ success: true, message: "refund already done" });
    }

    const refund =  razorpayInstance.payments.refund(PaymentId);

    await prisma.order.update({
      where: { id: order.id },
      data: {
        refunded: true,
        refundId: refund.id,
        refundStatus: refund.status,
      },
    });

    return NextResponse.json({ success: true, message: "refund successful", refund });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}