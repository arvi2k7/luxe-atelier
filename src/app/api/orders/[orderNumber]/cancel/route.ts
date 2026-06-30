import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await params;
  await connectDB();

  const order = await Order.findOne({ orderNumber, userId: session.user.id });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    return NextResponse.json({ error: "Order cannot be cancelled" }, { status: 400 });
  }

  order.status = "cancelled";
  await order.save();

  return NextResponse.json({ ok: true });
}
