import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AbandonedCart from "@/models/AbandonedCart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    const cartSid = req.cookies.get("cart_sid")?.value;

    if (!email || !cartSid) {
      return NextResponse.json({ error: "Email and session required" }, { status: 400 });
    }

    await connectDB();

    await AbandonedCart.findOneAndUpdate(
      { recoveryToken: cartSid },
      { $set: { email, lastActive: new Date() } },
      { upsert: true },
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to capture email" }, { status: 500 });
  }
}
