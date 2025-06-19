
import { NextResponse } from "next/server";
import prisma from "@/config/db";

export async function GET(request) {
  try {
    // Fetch all products using Prisma
    const products = await prisma.product.findMany();
  
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
    );
  }
}