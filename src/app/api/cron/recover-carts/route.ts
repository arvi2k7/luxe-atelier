import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AbandonedCart from "@/models/AbandonedCart";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const now = new Date();
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const stage1 = await AbandonedCart.find({
    lastActive: { $lte: fourHoursAgo, $gte: twentyFourHoursAgo },
    recoveryEmailSentAt: { $exists: false },
    recoveredAt: { $exists: false },
    email: { $exists: true, $ne: "" },
  }).lean();

  const stage2 = await AbandonedCart.find({
    lastActive: { $lte: twentyFourHoursAgo },
    recoveryEmailSentAt: { $exists: true },
    secondEmailSentAt: { $exists: false },
    recoveredAt: { $exists: false },
    email: { $exists: true, $ne: "" },
  }).lean();

  const results: string[] = [];

  for (const cart of stage1) {
    try {
      await AbandonedCart.findByIdAndUpdate(cart._id, {
        $set: { recoveryEmailSentAt: new Date() },
      });
      results.push(`Stage-1 email queued for ${cart.email}`);
    } catch {
      results.push(`Failed stage-1 for ${cart.email}`);
    }
  }

  for (const cart of stage2) {
    try {
      await AbandonedCart.findByIdAndUpdate(cart._id, {
        $set: { secondEmailSentAt: new Date() },
      });
      results.push(`Stage-2 email queued for ${cart.email}`);
    } catch {
      results.push(`Failed stage-2 for ${cart.email}`);
    }
  }

  return NextResponse.json({ recovered: results.length, details: results });
}
