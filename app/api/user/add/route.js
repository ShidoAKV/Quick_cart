
import { NextResponse } from "next/server";
import prisma from "@/config/db.js";

export async function POST(req) {
  try {
    const body = await req.json();

    const { id, name, email, imageUrl } = body;
    
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