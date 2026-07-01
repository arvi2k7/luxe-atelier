import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await connectDB();

  const data = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return NextResponse.json(data);
}
