import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request, { params }) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not Authorized" });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "No product found",
      });
    }
   

    const comments = await prisma.comment.findMany({
      where: {
        productId: id,
      },
      select: {
        rating: true,
      },
    });

    const ratingCount = comments.length;
    const avgRating = ratingCount
      ? comments.reduce((sum, c) => sum + c.rating, 0) / ratingCount
      : 0;


    return NextResponse.json({
      success: true,
      avgRating,
      ratingCount
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
