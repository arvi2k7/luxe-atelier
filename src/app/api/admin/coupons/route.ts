import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  const coupon = await Coupon.create({
    code: body.code,
    discountPercent: body.discountPercent,
    active: body.active ?? true,
    maxUses: body.maxUses ?? 0,
    expiresAt: body.expiresAt || undefined,
  });
  return NextResponse.json(coupon, { status: 201 });
}
