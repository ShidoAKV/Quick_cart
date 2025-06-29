import { NextResponse } from 'next/server';
import prisma from '@/config/db';

export async function POST(request) {
  try {
     const {id}=await request.json();
     if(!id){
        return NextResponse.json({success:false,message:'missing id'});
     }
     
     await prisma.tshirtSize.delete({
        where:{id}
     });

    return NextResponse.json({ success: true, message:'item deleted successfully' });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message }
    );
  }
}
