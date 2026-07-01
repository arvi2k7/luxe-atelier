import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().slice(0, 50);
  if (!q || q.length < 2) return NextResponse.json([]);

  await connectDB();
  const products = await Product.find({
    name: { $regex: escapeRegex(q), $options: "i" },
    stock: { $gt: 0 },
  }).limit(5).select("name slug price images category").lean();

  return NextResponse.json(products);
}
