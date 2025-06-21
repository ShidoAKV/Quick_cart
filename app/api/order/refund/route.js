import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

export async function GET(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

         const { searchParams } = new URL(req.url);
        
         const orderId = searchParams.get("orderId");
         
        if (!orderId) {
            return NextResponse.json({ success: false, message: "Missing orderId" });
        }
        
        const refunddata = await prisma.refund.findFirst({
            where: {
                orderId,
                userId
            }
        });
    
        if (!refunddata) {
            return NextResponse.json({ success: false, message: "Refund not claimed" });
        }
        
        return NextResponse.json({ success: true, refunddata });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
