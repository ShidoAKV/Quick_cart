import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Not Authorized' });
        }
        const { productId, rating } = await request.json();

        if (!productId || typeof rating !== "number") {
            return NextResponse.json(
                { success: false, message: "Product ID and valid rating are required" },
            );
        }

        const ratedUser = await prisma.user.findFirst({
            where: {
                id: userId,
                ratedProductIds: {
                    has: productId,
                },
            },
        });
        if (ratedUser) {
            return NextResponse.json({ success: false, message: "You have already voted" });
        }

        await prisma.$transaction([
            prisma.product.update({
                where: { id: productId },
                data: {
                    rating: { increment: rating },
                    ratingcount: { increment: 1 },
                },
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    ratedProductIds: {
                        push: productId,
                    },
                },
            }),
        ]);


        return NextResponse.json({ success: true, message: 'Thankyou for you you time' });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
        );
    }
}
