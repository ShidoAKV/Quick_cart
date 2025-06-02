// import connectDB from "@/config/db";
// import User from "@/models/User"; 

import { NextResponse } from "next/server";
import prisma from "@/config/db.js";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     await connectDB();

//     let existingUser = await User.findById(body.id);

//     if (!existingUser) {
      
//       const newUser = await User.create({
//         _id: body.id,
//         name: body.name || "unknown",
//         email: body.email,
//         imageUrl: body.imageUrl,
        
//       });

//       return NextResponse.json({ success: true, user: newUser });
//     } else {
    
//       let updated = false;
//       if (body.name && body.name !== existingUser.name) {
//         existingUser.name = body.name;
//         updated = true;
//       }
//       if (body.email && body.email !== existingUser.email) {
//         existingUser.email = body.email;
//         updated = true;
//       }
//       if (body.imageUrl && body.imageUrl !== existingUser.imageUrl) {
//         existingUser.imageUrl = body.imageUrl;
//         updated = true;
//       }

//       if (updated) {
//         await existingUser.save();
//       }

//       return NextResponse.json({ success: true, user: existingUser });
//     }
    
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

export async function POST(req) {
  try {
    const body = await req.json();

    const { id, name, email, imageUrl } = body;
    
    
    // Try to find existing user by ID
    let existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      // Create new user if not found
      const newUser = await prisma.user.create({
        data: {
          id,
          name: name || 'unknown',
          email,
          imageUrl,
        },
      });

      return NextResponse.json({ success: true, user: newUser });
    } else {
      // Check if any fields changed
      const updates = {};
      if (name && name !== existingUser.name) updates.name = name;
      if (email && email !== existingUser.email) updates.email = email;
      if (imageUrl && imageUrl !== existingUser.imageUrl) updates.imageUrl = imageUrl;

      if (Object.keys(updates).length > 0) {
        existingUser = await prisma.user.update({
          where: { id },
          data: updates,
        });
      }

      return NextResponse.json({ success: true, user: existingUser });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}