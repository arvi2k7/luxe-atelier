import mongoose, { Schema, model, models } from "mongoose";

export interface ILoyaltyTransaction {
  type: "earn" | "redeem" | "expire" | "bonus" | "referral";
  points: number;
  description: string;
  orderId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ILoyaltyAccount {
  userId: mongoose.Types.ObjectId;
  points: number;
  lifetimePoints: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  pendingReferralFor?: mongoose.Types.ObjectId;
  transactions: ILoyaltyTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const TIER_THRESHOLDS: Record<string, number> = { bronze: 0, silver: 500, gold: 2000, platinum: 5000 };

export function calculateTier(lifetimePoints: number): "bronze" | "silver" | "gold" | "platinum" {
  if (lifetimePoints >= 5000) return "platinum";
  if (lifetimePoints >= 2000) return "gold";
  if (lifetimePoints >= 500) return "silver";
  return "bronze";
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    type: { type: String, enum: ["earn", "redeem", "expire", "bonus", "referral"], required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LoyaltyAccountSchema = new Schema<ILoyaltyAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    points: { type: Number, default: 0 },
    lifetimePoints: { type: Number, default: 0 },
    tier: { type: String, enum: ["bronze", "silver", "gold", "platinum"], default: "bronze" },
    referralCode: { type: String, unique: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User" },
    pendingReferralFor: { type: Schema.Types.ObjectId, ref: "User" },
    transactions: { type: [LoyaltyTransactionSchema], default: [] },
  },
  { timestamps: true }
);

export default models.LoyaltyAccount || model<ILoyaltyAccount>("LoyaltyAccount", LoyaltyAccountSchema);
