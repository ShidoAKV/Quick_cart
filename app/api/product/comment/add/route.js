import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not Authorized" });
    }

    const { productId, comment, rating } = await request.json();

    if (!productId || !comment || !rating) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }


    const existingComment = await prisma.comment.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingComment) {
      return NextResponse.json({
        success: false,
        message: "You have already commented",
      });
    }


    const response = await prisma.comment.create({
      data: {
        text: comment,
        rating: parseInt(rating),
        userId,
        productId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment submitted successfully",
      response,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
