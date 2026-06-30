import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const orders = await Order.find({
    status: "delivered",
    reviewRequestSentAt: { $exists: false },
    deliveredAt: { $lte: sevenDaysAgo },
  }).lean();

  const results: string[] = [];
  for (const order of orders) {
    try {
      await Order.findByIdAndUpdate(order._id, {
        $set: { reviewRequestSentAt: new Date() },
      });
      results.push(`Review request queued for order ${order.orderNumber}`);
    } catch {
      results.push(`Failed for order ${order.orderNumber}`);
    }
  }

  return NextResponse.json({ queued: results.length, details: results });
}
