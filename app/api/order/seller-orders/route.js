
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";


export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isseller = await authSeller(userId);
    if (!isseller) {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    // Fetch all orders including related address and items with product details
    const orders = await prisma.order.findMany({
      include: {
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalOrders = orders.length;

    const totalAmount = orders
      .filter((o) => !o.cancelled && o.payment)
      .reduce((acc, o) => acc + Number(o.amount), 0);

    const totalRefunds = orders
      .filter((o) => o.claimedRefund && o.payment && o.refunded)
      .reduce((acc, o) => acc + Number(o.amount), 0);

    const pendingRefunds = orders
      .filter((o) => o.claimedRefund && o.payment && !o.refunded)
      .reduce((acc, o) => acc + Number(o.amount), 0);


    return NextResponse.json({
      success: true,
      orders,
      totalOrders,
      totalAmount,
      totalRefunds,
      pendingRefunds,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}








