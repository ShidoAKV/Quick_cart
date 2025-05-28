import connectDB from "@/config/db";
import Address from "@/models/Address";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items, amount, status, date } = await request.json();

    await connectDB();

    if (!userId || !address || !items || items.length === 0 || !amount || !date) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    const addressExists = await Address.findOne({ _id: address });
    if (!addressExists) {
      return NextResponse.json({ success: false, message: "Invalid address" });
    }

    const orderItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const newOrder = new Order({
      userId,
      address,
      items: orderItems,
      amount,
      status,
      date: Date.now(),
    });

    await newOrder.save();

    return NextResponse.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
