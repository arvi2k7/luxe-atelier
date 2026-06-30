import { Schema, model, models } from "mongoose";

export interface IReview {
  productId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  orderNumber: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 100 },
    body: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminNote: { type: String },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ status: 1 });

export default models.Review || model<IReview>("Review", ReviewSchema);
