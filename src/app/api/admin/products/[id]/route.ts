import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await connectDB();

  const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  await connectDB();

  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
