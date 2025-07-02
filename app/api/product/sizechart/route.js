import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/config/db';
import authSeller from '@/lib/authSeller';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorized' });
    }

    const body = await request.json();
    const { type, size, chest, len, sh, slv } = body;
    
    if (!type || !size || !chest || !len || !sh || !slv) {
      return NextResponse.json({ success: false, message: 'Missing fields' });
    }
    const exists = await prisma.tshirtSize.findFirst({
      where: { type, size },
    });

    if (exists) {
      return NextResponse.json(
        { success: false, message: 'Size already exists for this type' },
      );
    }

    const created = await prisma.tshirtSize.create({
      data: { type, size, chest, len, sh, slv },
    });
    
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
