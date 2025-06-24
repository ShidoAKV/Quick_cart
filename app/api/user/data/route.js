import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
     const email = request?.headers.get("email"); 
    
    if (!userId||!email) {
      return NextResponse.json({ success: false, message: "Unauthorized or missing email" }, { status: 404 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.id !== userId) {
      
      await prisma.user.deleteMany({ where: { email } });

      return NextResponse.json(
        { success: false, message: "User ID mismatch. Old record deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 404 });
  }
}
