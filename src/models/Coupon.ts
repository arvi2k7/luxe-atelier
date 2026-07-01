import { Schema, model, models } from "mongoose";

export interface ICoupon {
  code: string;
  discountPercent: number;
  active: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    active: { type: Boolean, default: true },
    maxUses: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1, active: 1 });
CouponSchema.index({ expiresAt: 1 });

export default models.Coupon || model<ICoupon>("Coupon", CouponSchema);
