import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { withTimeout } from "@/config/timeout";


export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' });
    }

    const user = await withTimeout(
    prisma.user.findUnique({
      where: { id: userId },
    }),8000);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' },{ status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message },{status:404});
  }
}