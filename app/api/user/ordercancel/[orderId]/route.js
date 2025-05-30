import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextResponse } from "next/server";

//delete the user order
export async function POST(request,{params}){

    try {
         const { orderId }=params;
        await connectDB();

        console.log(orderId);
        

        const order = await Order.findOne({ orderId } );

        if (!order) {
            return NextResponse.json({ success: false, message: "No order found" });
        }

        await Order.deleteOne({ orderId } );

        return NextResponse.json({ success: true, message: "Order deleted successfully" });


    } catch (error) {
        return NextResponse.json({success:false,message:error.message});
    }
}