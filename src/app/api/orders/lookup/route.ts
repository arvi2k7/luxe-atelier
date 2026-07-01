import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase(),
      "shipping.email": email.toLowerCase(),
    }).lean();

    if (!order) {
      return NextResponse.json(
        { error: "No order found with that number and email combination" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal,
      total: order.total,
      discount: order.discount,
      couponCode: order.couponCode,
      shipping: {
        fullName: order.shipping.fullName,
        addressLine1: order.shipping.addressLine1,
        addressLine2: order.shipping.addressLine2,
        city: order.shipping.city,
        state: order.shipping.state,
        postalCode: order.shipping.postalCode,
        country: order.shipping.country,
      },
      createdAt: order.createdAt,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to look up order" },
      { status: 500 }
    );
  }
}
