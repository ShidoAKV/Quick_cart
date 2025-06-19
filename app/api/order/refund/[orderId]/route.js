import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/config/db";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req, { params }) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { orderId } = await params;
        const body = await req.formData();

        const name = body.get('name');
        const email = body.get('email');
        const file = body.get('file');
        const reason=body.get('reason');

        if (!name || !email || !file || !orderId||!reason) {
            return NextResponse.json({ success: false, message: "Missing fields" });
        }


        const order = await prisma.order.findUnique({
            where: { orderId },
        });

        if (!order) {
            return NextResponse.json({
                success: false,
                message: "Invalid orderId — no such order exists.",
            });
        }


        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const cloudinaryUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });

        await prisma.order.update({
            where: { orderId },
            data: { claimedRefund: true},
        });

        const refund = await prisma.refund.create({
            data: {
                userId,
                orderId: order.id,
                name,
                email,
                photoUrl: cloudinaryUpload.secure_url,
                status: "PENDING",
                reason,
            },
        });


        return NextResponse.json({ success: true, message: "Refund submitted", refund });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
