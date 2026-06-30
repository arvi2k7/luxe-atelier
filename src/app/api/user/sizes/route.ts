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
    const { savedSizes } = await req.json();
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { $set: { savedSizes } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save sizes" }, { status: 500 });
  }
}
