import { NextResponse } from 'next/server';
import prisma from '@/config/db';

export async function GET() {
  try {
    const allSizes = await prisma.tshirtSize.findMany({
      orderBy: [{ type: 'asc' }, { size: 'asc' }],
    });
     
     
    const groupedByType = {};

    for (const item of allSizes) {
      const { type, size, chest, len, sh, slv,id} = item;

      if (!groupedByType[type]) {
        groupedByType[type] = {};
      }

      groupedByType[type][size] = {id,chest, len, sh, slv };
    }

    const result = Object.entries(groupedByType).map(([type, sizes]) => ({
      type,
      sizes,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message }
    );
  }
}
