import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";
import { z } from "zod/v3";

const sizesSchema = z.object({
  savedSizes: z.record(z.string()).optional(),
});

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = sizesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { $set: { savedSizes: parsed.data.savedSizes } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save sizes" }, { status: 500 });
  }
}
