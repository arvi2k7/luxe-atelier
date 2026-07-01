import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ReturnRequest from "@/models/ReturnRequest";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const { status } = await req.json();
    await connectDB();
    const validStatuses = ["submitted", "approved", "rejected", "received", "refunded"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await ReturnRequest.findByIdAndUpdate(id, { $set: { status } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update return" }, { status: 500 });
  }
}
