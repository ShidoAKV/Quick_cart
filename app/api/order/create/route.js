import connectDB from "@/config/db";
import Address from "@/models/Address";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
         const {userId}=getAuth(request);

         const {address,items}=await request.json();
         await connectDB();

         if(!address||items.length===0){
            return NextResponse.json({success:false,message:'Invalid Data'});
         }
         // calculate amound using items
         const amount=await items.reduce(async(acc,item)=>{
             const product=await  Product.findById(item.product);
             return await acc+product.offerPrice*item.quantity;
         },0);


     

         return NextResponse.json({success:true,message:'Address added successfully',newAddress});
    } catch (error) {
         return NextResponse.json({success:false,message:error.message});
    }
}