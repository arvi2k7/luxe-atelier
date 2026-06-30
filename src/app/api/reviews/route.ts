import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Review from "@/models/Review";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user?.id;
  const { productId, rating, title, body } = await req.json();

  if (!productId || !rating || !title || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();

  const hasOrdered = await Order.findOne({
    userId,
    "items.productId": productId,
    status: { $ne: "cancelled" },
  });
  if (!hasOrdered) {
    return NextResponse.json({ error: "You can only review products you have ordered." }, { status: 403 });
  }

  const existing = await Review.findOne({ productId, userId });
  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
  }

  const review = await Review.create({
    productId, userId, orderNumber: hasOrdered.orderNumber,
    rating, title, body, status: "pending",
  });

  return NextResponse.json({ ok: true, reviewId: String(review._id) });
}
