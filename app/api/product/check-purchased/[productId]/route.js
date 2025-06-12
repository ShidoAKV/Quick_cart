import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { withTimeout } from "@/config/timeout";


export async function POST(request, { params }) {
  try {
    const { userId } = getAuth(request);
    const { productId } =await params;
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

  
    const orders = await withTimeout(
      prisma.order.findMany({
        where: {
          userId,
          payment: true,
          items: {
            some: {
              productId, 
            },
          },
        },
        include: {
          items: true,
          address: true,
        },
        orderBy: { date: "desc" },
      }),
      10000
    );

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: false, message: "No paid order found with this product" });
    }
    return NextResponse.json({ success: true, message: "Paid order found" });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
