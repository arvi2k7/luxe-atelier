import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SavedAddress from "@/models/SavedAddress";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const addresses = await SavedAddress.find({ userId: session.user.id }).sort({ isDefault: -1, createdAt: -1 }).lean();
  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();

    if (body.isDefault) {
      await SavedAddress.updateMany({ userId: session.user.id }, { $set: { isDefault: false } });
    }

    const address = await SavedAddress.create({
      userId: session.user.id,
      label: body.label,
      fullName: body.fullName,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      country: body.country,
      phone: body.phone,
      isDefault: body.isDefault || false,
    });

    return NextResponse.json({ id: String(address._id) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
