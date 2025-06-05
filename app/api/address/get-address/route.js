import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { withTimeout } from "@/config/timeout";


export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No user ID found' }, { status: 401 });
    }

    const addresses = await withTimeout(
    prisma.address.findMany({
      where: { userId }
    }),8000);

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}