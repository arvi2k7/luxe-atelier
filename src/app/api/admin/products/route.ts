import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  await connectDB();

  const slug = body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const product = await Product.create({ ...body, slug });
  return NextResponse.json(product, { status: 201 });
}
