import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    const { token, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(user._id, {
      $set: { passwordHash },
      $unset: { resetToken: "", resetTokenExpires: "" },
    });

    return NextResponse.json({ message: "Password has been reset successfully." });
  } catch {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
