// import connectDB from "@/config/db";
// import Product from "@/models/Product";
import { NextResponse } from "next/server";
import prisma from "@/config/db";


// export async function GET(request){
//       try {
        
//           await connectDB();
//           const products=await Product.find({});

//           return NextResponse.json({success:true,products});
//       } catch (error) {
//         return NextResponse.json({success:false,message:error.message});
//       }
// }

export async function GET(request) {
  try {
    // Fetch all products using Prisma
    const products = await prisma.product.findMany();
  
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}