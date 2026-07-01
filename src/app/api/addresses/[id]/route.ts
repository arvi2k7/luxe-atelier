import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SavedAddress from "@/models/SavedAddress";
import { auth } from "@/auth";
import { addressSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = addressSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    await connectDB();

    if (body.isDefault) {
      await SavedAddress.updateMany({ userId: session.user.id, _id: { $ne: id } }, { $set: { isDefault: false } });
    }

    const address = await SavedAddress.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: parsed.data },
      { new: true },
    );
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    return NextResponse.json({ id: String(address._id) });
  } catch {
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  await SavedAddress.findOneAndDelete({ _id: id, userId: session.user.id });
  return NextResponse.json({ ok: true });
}
