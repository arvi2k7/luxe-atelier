import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, bio } = await req.json();
    await connectDB();
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;
    await User.findByIdAndUpdate(session.user.id, { $set: update });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
