import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { couponValidateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = couponValidateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing coupon code" }, { status: 400 });
    }
    const { code, subtotal } = parsed.data;
    if (subtotal === undefined) {
      return NextResponse.json({ error: "Subtotal required for discount calculation" }, { status: 400 });
    }

    await connectDB();
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    const discount = Math.round((subtotal * coupon.discountPercent) / 100);
    const total = Math.max(0, subtotal - discount);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discount,
      total,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
