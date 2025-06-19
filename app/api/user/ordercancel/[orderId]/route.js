
import { NextResponse } from "next/server";
import prisma from "@/config/db";

export async function POST(request, { params }) {
    try {
        const { orderId } =await params;

        // Find the order by orderId
        const order = await prisma.order.findUnique({
            where: { orderId },
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "No order found" });
        }

        await prisma.orderItem.deleteMany({
            where: { orderId: order.id },
        });

        // Now delete the order
        await prisma.order.delete({
            where: { id: order.id },
        });

        return NextResponse.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}