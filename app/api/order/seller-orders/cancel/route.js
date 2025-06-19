import authSeller from "@/lib/authSeller";
import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { orderId } = await request.json();

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    const order = await prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "orderId wrong" });
    }

    await prisma.order.update({
      where: { orderId },
      data: { cancelled: true },
    });

    return NextResponse.json({ success: true, message: "order cancelled successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}