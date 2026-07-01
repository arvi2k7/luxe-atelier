import mongoose, { Schema, model, models } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface IShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shipping: IShippingInfo;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  total: number;
  couponCode?: string;
  discount?: number;
  customerNote?: string;
  trackingUrl?: string;
  shippedEmailSentAt?: Date;
  deliveredEmailSentAt?: Date;
  reviewRequestSentAt?: Date;
  pointsRedeemed?: number;
  giftCardCode?: string;
  giftCardApplied?: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const ShippingInfoSchema = new Schema<IShippingInfo>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], required: true },
    shipping: { type: ShippingInfoSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    couponCode: { type: String },
    discount: { type: Number },
    customerNote: { type: String, maxlength: 500 },
    trackingUrl: { type: String },
    shippedEmailSentAt: { type: Date },
    deliveredEmailSentAt: { type: Date },
    reviewRequestSentAt: { type: Date },
    pointsRedeemed: { type: Number },
    giftCardCode: { type: String },
    giftCardApplied: { type: Number },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ status: 1, shippedEmailSentAt: 1 });
OrderSchema.index({ status: 1, deliveredEmailSentAt: 1 });
OrderSchema.index({ status: 1, reviewRequestSentAt: 1 });

export default models.Order || model<IOrder>("Order", OrderSchema);
