import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";


export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { cartData } = await request.json();
      
    await prisma.user.update({
      where: { id: userId },
      data: {
        cartItems: cartData,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}