import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import StockAlert from "@/models/StockAlert";

export async function POST(request: Request) {
  try {
    const { productId, email } = await request.json();

    if (!productId || !email) {
      return NextResponse.json({ error: "Product ID and email are required" }, { status: 400 });
    }

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
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
