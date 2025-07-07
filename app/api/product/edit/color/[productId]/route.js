import { NextResponse } from "next/server";
import prisma from "@/config/db";
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request, { params }) {
  try {
    const { userId } = getAuth(request);
    if (!(await authSeller(userId))) {
      return NextResponse.json({ success: false, message: 'Not authorised' });
    }
 
    const { productId } = await params;
    const { color } = await request.json();
   
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" });
    }

    const updatedColorMap = { ...(product.colorImageMap || {}) };
    delete updatedColorMap[color];

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        colorImageMap: updatedColorMap,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: `Color"${color}" removed successfully.`,
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
    );
  }
}
