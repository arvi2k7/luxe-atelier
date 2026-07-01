import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ReturnRequest from "@/models/ReturnRequest";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { returnRequestSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const returns = await ReturnRequest.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(returns);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = returnRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    const { orderNumber, items, notes } = parsed.data;
    await connectDB();

    const order = await Order.findOne({ orderNumber, userId: session.user.id }).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const returnRequest = await ReturnRequest.create({
      orderNumber,
      userId: session.user.id,
      items,
      notes,
      status: "submitted",
    });

    return NextResponse.json({ id: String(returnRequest._id) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create return request" }, { status: 500 });
  }
}
