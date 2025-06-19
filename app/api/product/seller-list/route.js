import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";


export async function GET(request){
      try {
         const {userId}=getAuth(request);

          const isseller=authSeller(userId);
          if(!isseller){
            return NextResponse.json({success:false,message:'not authorized'});
          }

          const products = await prisma.product.findMany();
  
          return NextResponse.json({success:true,products});
      } catch (error) {
        return NextResponse.json({success:false,message:error.message});
      }
}