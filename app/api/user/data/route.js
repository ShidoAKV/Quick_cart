// import connectDB from "@/config/db";
// import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

// fetch the user data
// export async function GET(request){

//     try {
//         const {userId}=getAuth(request);
         
//         await connectDB();

//         const user=await User.findById(userId);
//         if(!user){
//             return NextResponse.json({success:false,message:'user not found'});
//         }

//         return NextResponse.json({success:true,user});

//     } catch (error) {
//         return NextResponse.json({success:false,message:error.message});
//     }
// }

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user using Prisma
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}