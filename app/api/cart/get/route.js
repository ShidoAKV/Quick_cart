import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

export async function GET(request) {
  try {
    const { userId }=getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" });
    }
    
    // Fetch user with cartItems using Prisma
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        cartItems: true,
      },
    });
   
   
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
      );
    }

    return NextResponse.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}