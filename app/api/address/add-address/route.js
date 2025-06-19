import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { withTimeout } from "@/config/timeout";


export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
      );
    }

    const  { address }= await request.json();
    const { fullName, phoneNumber, pincode, area, city,state }=address;

     if (!fullName || !phoneNumber || !pincode || !area || !city || !state) {
      return NextResponse.json({ success: false, message: 'All fields are required' });
    }

    const newAddress = await withTimeout(
    prisma.address.create({
      data: {
       userId,        
        fullName,
        phoneNumber,
        pincode:parseInt(pincode),
        area,
        city,
        state
      },
    }),10000);
   

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      newAddress,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
    );
  }
}