import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import type { IWishlist } from "@/models/Wishlist";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const wishlist = await Wishlist.findOne({ userId: session.user.id });
  if (!wishlist) {
    return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });
  }

  const wishlistDoc = wishlist as unknown as IWishlist;
  if (!wishlistDoc.shareToken) {
    const shareToken = crypto.randomBytes(16).toString("hex");
    await Wishlist.findByIdAndUpdate(wishlist._id, { $set: { shareToken } });
    return NextResponse.json({ shareToken });
  }

  return NextResponse.json({ shareToken: wishlistDoc.shareToken });
}
