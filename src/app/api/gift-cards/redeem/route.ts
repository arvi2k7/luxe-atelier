import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GiftCard from "@/models/GiftCard";

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Gift card code required" }, { status: 400 });
    }

    await connectDB();

    const card = await GiftCard.findOne({ code: code.toUpperCase().trim() });

    if (!card) {
      return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    }

    if (card.status !== "active") {
      return NextResponse.json({ error: "Gift card is no longer active" }, { status: 400 });
    }

    if (card.balance <= 0) {
      return NextResponse.json({ error: "Gift card has no remaining balance" }, { status: 400 });
    }

    if (card.expiresAt && new Date(card.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Gift card has expired" }, { status: 400 });
    }

    const appliedAmount = Math.min(card.balance, orderTotal || card.balance);

    return NextResponse.json({
      valid: true,
      balance: card.balance,
      appliedAmount,
      message: `Gift card applied — $${appliedAmount.toFixed(2)}`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to redeem gift card" }, { status: 500 });
  }
}
