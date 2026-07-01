import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import StockAlert from "@/models/StockAlert";
import { sendBackInStock } from "@/lib/emails";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const { stock } = await req.json();

  if (typeof stock !== "number" || stock < 0) {
    return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
  }

  await connectDB();
  const prev = await Product.findById(id);
  if (!prev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const wasOutOfStock = prev.stock === 0;
  const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });

  if (wasOutOfStock && stock > 0) {
    const alerts = await StockAlert.find({ productId: id, notified: false });
    for (const alert of alerts) {
      try {
        await sendBackInStock({
          email: alert.email,
          productName: product.name,
          productSlug: product.slug,
        });
        await StockAlert.findByIdAndUpdate(alert._id, { notified: true });
      } catch (err) {
        console.error("Back-in-stock email failed:", err);
      }
    }
  }

  return NextResponse.json(product);
}
