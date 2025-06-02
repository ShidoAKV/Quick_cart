// import connectDB from "@/config/db";
// import Address from "@/models/Address";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

// export async function GET(request) {
//   try {
//     const { userId } = getAuth(request);
//     await connectDB();

//     const orders = await Order.find({ userId })
//       .populate("address")
//       .populate("items.product");
     
//     return NextResponse.json({ success: true, orders });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message });
//   }
// }


export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const orders = await prisma.order.findMany({
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
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
