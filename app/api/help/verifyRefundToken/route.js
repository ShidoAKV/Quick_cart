import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User Unauthorized' }, { status: 401 });
    }

    const { refundtoken } = await request.json();
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.json({ success: false, message: 'Server misconfigured: JWT_SECRET missing' });
    }

    try {
      const decoded = jwt.verify(refundtoken, secret);

      if (!decoded) {
        return NextResponse.json({
          success: false,
          message: 'Incorrect token',
        });
      }

      return NextResponse.json({
        success: true,
        message: "verified successfully"
      });

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return NextResponse.json({ success: false, message: 'Token has expired' });
      } else if (err.name === 'JsonWebTokenError') {
        return NextResponse.json({ success: false, message: 'Invalid token' });
      } else {
        return NextResponse.json({ success: false, message: 'Token verification failed' });
      }
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
