import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import StockAlert from "@/models/StockAlert";
import { stockAlertSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = stockAlertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    const { productId, email } = parsed.data;

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock > 0) {
      return NextResponse.json({ error: "Product is in stock" }, { status: 400 });
    }

    const existing = await StockAlert.findOne({ productId, email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ message: "You are already subscribed for this product." });
    }

    await StockAlert.create({
      productId,
      email: email.toLowerCase(),
    });

    return NextResponse.json({ message: "We will notify you when this item is back in stock." });
  } catch {
    return NextResponse.json(
      { error: "Failed to process notification request" },
      { status: 500 }
    );
  }
}
