import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connectDB();
    await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), source: source || "unknown", active: true },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
