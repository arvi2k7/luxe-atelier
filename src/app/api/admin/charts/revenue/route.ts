import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await connectDB();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const data = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" }, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return NextResponse.json(data);
}
