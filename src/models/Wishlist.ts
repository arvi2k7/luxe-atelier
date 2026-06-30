import { Schema, model, models } from "mongoose";

export interface IWishlistItem {
  productId: Schema.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist {
  userId: Schema.Types.ObjectId;
  items: IWishlistItem[];
  shareToken?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [WishlistItemSchema], default: [] },
    shareToken: { type: String, sparse: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Wishlist || model<IWishlist>("Wishlist", WishlistSchema);
