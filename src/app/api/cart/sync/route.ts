import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AbandonedCart from "@/models/AbandonedCart";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, email } = body;
    const cartSid = req.cookies.get("cart_sid")?.value;

    if (!cartSid) {
      return NextResponse.json({ error: "No cart session" }, { status: 400 });
    }

    await connectDB();

    const update: Record<string, any> = {
      items: items || [],
      lastActive: new Date(),
    };
    if (email) update.email = email;
    if (session?.user?.id) update.userId = session.user.id;

    await AbandonedCart.findOneAndUpdate(
      { recoveryToken: cartSid },
      { $set: update },
      { upsert: true, new: true },
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
