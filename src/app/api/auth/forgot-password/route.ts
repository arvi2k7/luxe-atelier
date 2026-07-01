import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/emails";
import { forgotPasswordSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const { email } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, { $set: { resetToken, resetTokenExpires } });

    try {
      await sendPasswordResetEmail({ email: user.email, resetToken });
    } catch {
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
