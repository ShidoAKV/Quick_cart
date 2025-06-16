import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isseller = await authSeller(userId);

    if (!isseller) {
      return NextResponse.json({ success: false, message: "Not authorized" });
    }

    const { action, id } = await request.json();
   
    if (!action || !id)   {
      return NextResponse.json({ success: false, message: "Missing action or orderid" });
    }

    const refundRecord = await prisma.refund.findFirst({
      where: {
        orderId:id
       },
    });
   

    if (!refundRecord) {
      return NextResponse.json({ success: false, message: "Refund record not found" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id
       },
    });
    

    if(order.refunded){
      return NextResponse.json({ success:false, message: `refund already issued` });
    }
 

    await prisma.refund.update({
      where: {id:refundRecord.id },
      data: { status: action },
    });

    return NextResponse.json({ success: true, message: `${action} successfully` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
