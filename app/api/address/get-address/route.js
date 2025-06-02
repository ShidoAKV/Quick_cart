// import connectDB from "@/config/db";
// import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

// export async function GET(request){
//     try {
//          const {userId}=getAuth(request);
//           await connectDB();

//          const addresses=await Address.find({userId});
          
//          return NextResponse.json({success:true,addresses});
//     } catch (error) {
//          return NextResponse.json({success:true,message:error.message});
//     }
// }

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No user ID found' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId }
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}