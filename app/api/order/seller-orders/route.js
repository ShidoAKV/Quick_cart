import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isseller = await authSeller(userId);
        if (!isseller) {
            return NextResponse.json({ success: false, message: 'not authorized' })
        }
        await connectDB();

        const orders = await Order.find({}).populate('address items.product');
        const totalOrders = orders.length;

        const totalAmount = orders
            .filter(o => !o.cancelled && o.payment)
            .reduce((acc, o) => acc + Number(o.amount), 0);

        const totalRefunds = orders
            .filter(o => o.cancelled && o.payment)
            .reduce((acc, o) => acc + Number(o.amount), 0);

        const pendingRefunds = orders
            .filter(o => o.cancelled && o.payment && !o.refunded)
            .reduce((acc, o) => acc + Number(o.amount), 0);

        return NextResponse.json({
            success: true,
            orders,
            totalOrders,
            totalAmount,
            totalRefunds,
            pendingRefunds,
        });


    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}