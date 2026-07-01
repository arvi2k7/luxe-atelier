import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { emailSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    await connectDB();
    await Subscriber.findOneAndUpdate(
      { email: parsed.data },
      { email: parsed.data, source: source || "unknown", active: true },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
