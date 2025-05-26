import connectDB from "@/config/db";
import User from "@/models/User"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    await connectDB();

    let existingUser = await User.findById(body.id);

    if (!existingUser) {
      
      const newUser = await User.create({
        _id: body.id,
        name: body.name || "unknown",
        email: body.email,
        imageUrl: body.imageUrl,
        
      });

      return NextResponse.json({ success: true, user: newUser });
    } else {
    
      let updated = false;
      if (body.name && body.name !== existingUser.name) {
        existingUser.name = body.name;
        updated = true;
      }
      if (body.email && body.email !== existingUser.email) {
        existingUser.email = body.email;
        updated = true;
      }
      if (body.imageUrl && body.imageUrl !== existingUser.imageUrl) {
        existingUser.imageUrl = body.imageUrl;
        updated = true;
      }

      if (updated) {
        await existingUser.save();
      }

      return NextResponse.json({ success: true, user: existingUser });
    }
    
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
