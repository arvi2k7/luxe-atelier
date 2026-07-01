import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { couponSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await connectDB();

  const coupon = await Coupon.create({
    code: parsed.data.code,
    discountPercent: parsed.data.discountPercent,
    active: parsed.data.active,
    maxUses: parsed.data.maxUses,
    expiresAt: parsed.data.expiresAt || undefined,
  });
  return NextResponse.json(coupon, { status: 201 });
}
