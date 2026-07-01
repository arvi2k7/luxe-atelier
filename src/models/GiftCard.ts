import { Schema, model, models } from "mongoose";

export interface IGiftCardTransaction {
  orderId?: Schema.Types.ObjectId;
  amount: number;
  description: string;
  createdAt: Date;
}

export interface IGiftCard {
  code: string;
  initialBalance: number;
  currentBalance: number;
  purchasedByUserId?: Schema.Types.ObjectId;
  recipientEmail?: string;
  recipientName?: string;
  giftMessage?: string;
  expiresAt?: Date;
  active: boolean;
  transactions: IGiftCardTransaction[];
  createdAt: Date;
}

const GiftCardTransactionSchema = new Schema<IGiftCardTransaction>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const GiftCardSchema = new Schema<IGiftCard>(
  {
    code: { type: String, required: true, unique: true },
    initialBalance: { type: Number, required: true, min: 0 },
    currentBalance: { type: Number, required: true, min: 0 },
    purchasedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    recipientEmail: { type: String },
    recipientName: { type: String },
    giftMessage: { type: String },
    expiresAt: { type: Date },
    active: { type: Boolean, default: true },
    transactions: { type: [GiftCardTransactionSchema], default: [] },
  },
  { timestamps: true }
);

GiftCardSchema.index({ code: 1 }, { unique: true });
GiftCardSchema.index({ purchasedByUserId: 1 });
GiftCardSchema.index({ recipientEmail: 1 });

export default models.GiftCard || model<IGiftCard>("GiftCard", GiftCardSchema);
