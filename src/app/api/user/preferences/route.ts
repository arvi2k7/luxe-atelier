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
    const { email, marketing, orderUpdates } = await req.json();
    await connectDB();

    const update: Record<string, unknown> = {};
    if (email !== undefined) update.email = email;
    if (marketing !== undefined) update["emailPreferences.marketing"] = marketing;
    if (orderUpdates !== undefined) update["emailPreferences.orderUpdates"] = orderUpdates;

    await User.findByIdAndUpdate(session.user.id, { $set: update });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
