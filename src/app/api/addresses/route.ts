import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SavedAddress from "@/models/SavedAddress";
import { auth } from "@/auth";
import { addressSchema } from "@/lib/validations";

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
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    await connectDB();

    if (body.isDefault) {
      await SavedAddress.updateMany({ userId: session.user.id }, { $set: { isDefault: false } });
    }

    const address = await SavedAddress.create({
      userId: session.user.id,
      label: parsed.data.label ?? "",
      fullName: parsed.data.fullName,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2,
      city: parsed.data.city,
      state: parsed.data.state,
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
      phone: parsed.data.phone,
      isDefault: parsed.data.isDefault,
    });

    return NextResponse.json({ id: String(address._id) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
