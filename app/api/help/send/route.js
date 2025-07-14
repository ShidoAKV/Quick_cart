// app/api/send-refund-link/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, email } = await request.json();

        if (!orderId || !userId || !email) {
            return NextResponse.json({ success: false, message: "Missing fields" });
        }


        const token = jwt.sign({ orderId, userId }, process.env.JWT_SECRET, {
            expiresIn: "10m",
        });

        const origin = request.headers.get("origin") || process.env.BASE_URL || "http://localhost:3000";
        const refundLink = `${origin}/refundpage?token=${token}&id=${orderId}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Your Refund Link",
            html: `
    <p>Click the button below to process your refund (valid for 10 minutes):</p>
    <a href="${refundLink}" style="
      display: inline-block;
      padding: 10px 20px;
      background-color: #2563EB;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 10px;
    ">
      Open Refund Page
    </a>
    <p style="color: gray; font-size: 12px; margin-top: 10px;">
      This link is valid for 10 minutes only.
    </p>
  `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Refund link sent successfully", token });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
