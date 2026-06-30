import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { auth } from "@/auth";
import { sendOrderConfirmation, sendNewOrderAdmin } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shipping, subtotal, total, couponCode } = body;

    if (!items?.length || !shipping) {
      return NextResponse.json(
        { error: "Missing items or shipping info" },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await auth();
    const userId = session?.user?.id;

    let discount: number | undefined;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
      });
      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }
      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }

    const finalTotal = discount ? Math.max(0, total - discount) : total;

    const orderNumber = `LA-${Date.now().toString(36).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      ...(userId ? { userId } : {}),
      items,
      shipping,
      subtotal,
      total: finalTotal,
      ...(couponCode ? { couponCode: couponCode.toUpperCase(), discount } : {}),
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, [
        { $set: { stock: { $max: [0, { $subtract: ["$stock", item.quantity] }] } } },
      ]);
    }

    try {
      await Promise.all([
        sendOrderConfirmation({
          orderNumber: order.orderNumber,
          customerName: shipping.fullName,
          items,
          shipping,
          total,
        }),
        sendNewOrderAdmin({
          orderNumber: order.orderNumber,
          customerName: shipping.fullName,
          customerEmail: shipping.email,
          items,
          total,
          orderId: String(order._id),
        }),
      ]);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
