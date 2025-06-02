// import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
// import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

// export async function GET(request){
//       try {
//          const {userId}=getAuth(request);

//           const isseller=authSeller(userId);
//           if(!isseller){
//             return NextResponse.json({success:false,message:'not authorized'});
//           }

//            await connectDB();
//           const products=await Product.find({});

//           return NextResponse.json({success:true,products});
//       } catch (error) {
//         return NextResponse.json({success:false,message:error.message});
//       }
// }

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