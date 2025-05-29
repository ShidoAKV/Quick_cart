import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
         const {userId}=getAuth(request);
         const {orderId}=await request.json();
         const isseller=await authSeller(userId);
        
          
         
         if(!isseller){
             return NextResponse.json({success:false,message:'not authorized'})
         }
         await connectDB();

        const order=await Order.findById({orderId});
         order.cancelled=false;
         await order.save();
       
         return NextResponse.json({success:true,message:'order deleted successfully'});
    } catch (error) {
         return NextResponse.json({success:false,message:error.message});
    }
}