import { Schema, model, models } from "mongoose";

export interface ICartItem {
  productId: Schema.Types.ObjectId;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface IAbandonedCart {
  sessionId: string;
  userId?: Schema.Types.ObjectId;
  email?: string;
  items: ICartItem[];
  subtotal: number;
  recoveryToken: string;
  emailSentAt?: Date;
  recoveredAt?: Date;
  status: "active" | "recovered" | "expired";
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const AbandonedCartSchema = new Schema<IAbandonedCart>(
  {
    sessionId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String },
    items: { type: [CartItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    recoveryToken: { type: String, required: true },
    emailSentAt: { type: Date },
    recoveredAt: { type: Date },
    status: { type: String, enum: ["active", "recovered", "expired"], default: "active" },
  },
  { timestamps: true }
);

AbandonedCartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 1209600 });
AbandonedCartSchema.index({ sessionId: 1 });
AbandonedCartSchema.index({ email: 1 });
AbandonedCartSchema.index({ recoveryToken: 1 }, { unique: true });
AbandonedCartSchema.index({ status: 1 });

export default models.AbandonedCart || model<IAbandonedCart>("AbandonedCart", AbandonedCartSchema);
