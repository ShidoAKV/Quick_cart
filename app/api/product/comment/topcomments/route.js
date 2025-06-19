import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {

        const topComment = await prisma.comment.findMany({
            orderBy: [
                { productId: 'asc' },
                { rating: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                user: {
                    select: { name:true }  
                },
                product: {
                    select: { category: true,size:true,name:true }
                }
            },
            take: 1000 
        });

        return NextResponse.json({
            success: true,
            topComment
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}
