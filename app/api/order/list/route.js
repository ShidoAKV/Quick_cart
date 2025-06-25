import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { withTimeout } from "@/config/timeout";


export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const orders = await withTimeout(
      prisma.order.findMany({
        where: { userId },
        include: {
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      })
      , 10000);
     
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
