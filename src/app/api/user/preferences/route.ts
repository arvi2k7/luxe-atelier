import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";
import { preferencesSchema } from "@/lib/validations";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = preferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    await connectDB();

    const update: Record<string, unknown> = {};
    if (parsed.data.email !== undefined) update.email = parsed.data.email;
    if (parsed.data.marketing !== undefined) update["emailPreferences.marketing"] = parsed.data.marketing;
    if (parsed.data.orderUpdates !== undefined) update["emailPreferences.orderUpdates"] = parsed.data.orderUpdates;

    await User.findByIdAndUpdate(session.user.id, { $set: update });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
