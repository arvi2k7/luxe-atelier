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

  const now = new Date();
  const results: string[] = [];

  const shipped = await Order.find({
    status: "shipped",
    shippedEmailSentAt: { $exists: false },
  }).lean();

  for (const order of shipped) {
    try {
      await Order.findByIdAndUpdate(order._id, {
        $set: { shippedEmailSentAt: now },
      });
      results.push(`Shipped email queued for ${order.orderNumber}`);
    } catch {
      results.push(`Failed shipped email for ${order.orderNumber}`);
    }
  }

  const delivered = await Order.find({
    status: "delivered",
    deliveredEmailSentAt: { $exists: false },
  }).lean();

  for (const order of delivered) {
    try {
      await Order.findByIdAndUpdate(order._id, {
        $set: { deliveredEmailSentAt: now },
      });
      results.push(`Delivered email queued for ${order.orderNumber}`);
    } catch {
      results.push(`Failed delivered email for ${order.orderNumber}`);
    }
  }

  return NextResponse.json({ queued: results.length, details: results });
}
