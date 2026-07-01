import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GiftCard from "@/models/GiftCard";
import { auth } from "@/auth";
import { giftCardPurchaseSchema } from "@/lib/validations";

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "LA-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = giftCardPurchaseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    const { amount, recipientEmail, senderName, message } = parsed.data;

    await connectDB();

    let code: string;
    do {
      code = generateCode();
    } while (await GiftCard.findOne({ code }));

    const card = await GiftCard.create({
      code,
      initialBalance: amount,
      balance: amount,
      status: "active",
      recipientEmail,
      senderName: senderName || undefined,
      message: message || undefined,
      createdBy: session.user.id,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    await GiftCard.findByIdAndUpdate(card._id, {
      $push: {
        transactions: {
          type: "issued",
          amount,
          note: `Gift card created by ${senderName || "anonymous"}`,
        },
      },
    });

    return NextResponse.json({ code, id: String(card._id) });
  } catch {
    return NextResponse.json({ error: "Failed to create gift card" }, { status: 500 });
  }
}
