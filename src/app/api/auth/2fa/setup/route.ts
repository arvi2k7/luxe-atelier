import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateSecret, generateURI } from "otplib";
import qrcode from "qrcode";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const secret = generateSecret();
  const otpauth = generateURI({ issuer: "Luxe Atelier", label: session.user.email || "admin@luxe-atelier.com", secret });

  await User.findByIdAndUpdate(session.user.id, { $set: { totpSecret: secret } });

  const qrCode = await qrcode.toDataURL(otpauth);

  return NextResponse.json({ qrCode, secret });
}
