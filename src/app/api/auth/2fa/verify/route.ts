import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verify } from "otplib";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json();
  if (!token || token.length !== 6) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || !user.totpSecret) {
    return NextResponse.json({ error: "2FA not set up" }, { status: 400 });
  }

  const isValid = verify({ token, secret: user.totpSecret });
  if (!isValid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await User.findByIdAndUpdate(session.user.id, { $set: { twoFactorEnabled: true } });

  return NextResponse.json({ ok: true });
}
