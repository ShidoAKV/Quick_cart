import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { withTimeout } from "@/config/timeout";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items, amount, status, date } = await request.json();


    if (!userId || !address || !items || items.length === 0 || !amount || !date) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    const newOrder =  await withTimeout(
     prisma.order.create({
      data: {
        userId: userId,
        addressId: address,
        amount: amount,
        status: status,
        date: new Date(date),

        items: {
          create: items.map(item => ({
            productId: item.product,
            size: item.size,
            color: item.color,
            quantity: item.quantity.quantity
          }))
        },
      },
      include: {
        items: true,
        address: true,
      },
    }),10000);

    return NextResponse.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
