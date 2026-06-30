import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user?.id;
  await connectDB();

  let wishlist = await Wishlist.findOne({ userId }).populate("items.productId").lean();
  if (!wishlist) wishlist = { items: [] } as unknown as Record<string, unknown>;

  return NextResponse.json(wishlist);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user?.id;
  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  await connectDB();

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { items: { productId, addedAt: new Date() } } },
    { upsert: true, new: true }
  );

  return NextResponse.json(wishlist);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user?.id;
  const { productId } = await request.json();

  await connectDB();

  await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } }
  );

  return NextResponse.json({ success: true });
}
