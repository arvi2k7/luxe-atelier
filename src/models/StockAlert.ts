import { Schema, model, models } from "mongoose";

export interface IStockAlert {
  productId: Schema.Types.ObjectId;
  email: string;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StockAlertSchema = new Schema<IStockAlert>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    email: { type: String, required: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

StockAlertSchema.index({ productId: 1, email: 1 }, { unique: true });
StockAlertSchema.index({ productId: 1, notified: 1 });

export default models.StockAlert || model<IStockAlert>("StockAlert", StockAlertSchema);
