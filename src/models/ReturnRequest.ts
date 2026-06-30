import { Schema, model, models } from "mongoose";

export interface IReturnItem {
  productName: string;
  size: string;
  quantity: number;
  reason: "wrong_size" | "damaged" | "not_as_described" | "changed_mind" | "other";
}

export interface IReturnRequest {
  orderNumber: string;
  userId: Schema.Types.ObjectId;
  items: IReturnItem[];
  notes?: string;
  status: "submitted" | "approved" | "rejected" | "received" | "refunded";
  adminNote?: string;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnItemSchema = new Schema<IReturnItem>(
  {
    productName: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: {
      type: String,
      enum: ["wrong_size", "damaged", "not_as_described", "changed_mind", "other"],
      required: true,
    },
  },
  { _id: false }
);

const ReturnRequestSchema = new Schema<IReturnRequest>(
  {
    orderNumber: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [ReturnItemSchema], required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected", "received", "refunded"],
      default: "submitted",
    },
    adminNote: { type: String },
    refundAmount: { type: Number },
  },
  { timestamps: true }
);

ReturnRequestSchema.index({ orderNumber: 1 });
ReturnRequestSchema.index({ userId: 1 });
ReturnRequestSchema.index({ status: 1 });

export default models.ReturnRequest || model<IReturnRequest>("ReturnRequest", ReturnRequestSchema);
