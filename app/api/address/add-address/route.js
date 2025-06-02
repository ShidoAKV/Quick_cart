// import connectDB from "@/config/db";
// import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";

// export async function POST(request){
//     try {
//          const {userId}=getAuth(request);

//          const {address}=await request.json();
//          await connectDB();

//          const newAddress=await Address.create({...address,userId});

//          return NextResponse.json({success:true,message:'Address added successfully',newAddress});
//     } catch (error) {
//          return NextResponse.json({success:true,message:error.message});
//     }
// }
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const  { address }= await request.json();
    const { fullName, phoneNumber, pincode, area, city,state }=address;
    console.log({ fullName, phoneNumber, pincode, area, city,state })
    

     if (!fullName || !phoneNumber || !pincode || !area || !city || !state) {
      return NextResponse.json({ success: false, message: 'All fields are required' });
    }

    const newAddress = await prisma.address.create({
      data: {
       userId,        
        fullName,
        phoneNumber,
        pincode:parseInt(pincode),
        area,
        city,
        state
      },
    });
   

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      newAddress,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}