import { Schema, model, models } from "mongoose";

export interface IColorVariant {
  color: string;
  hex: string;
  slug: string;
}

export interface IPressQuote {
  publication: string;
  quote: string;
  url?: string;
}

export interface IModelStats {
  height: string;
  size: string;
  note?: string;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  fitNotes?: string;
  modelStats?: IModelStats;
  bundleIds?: Schema.Types.ObjectId[];
  exclusive: boolean;
  colorVariants?: IColorVariant[];
  pressQuotes?: IPressQuote[];
  backInStock: boolean;
  lastLowStockAlertSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ColorVariantSchema = new Schema<IColorVariant>(
  { color: { type: String, required: true }, hex: { type: String, required: true }, slug: { type: String, required: true } },
  { _id: false }
);

const PressQuoteSchema = new Schema<IPressQuote>(
  { publication: { type: String, required: true }, quote: { type: String, required: true, maxlength: 150 }, url: { type: String } },
  { _id: false }
);

const ModelStatsSchema = new Schema<IModelStats>(
  { height: { type: String, required: true }, size: { type: String, required: true }, note: { type: String } },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    sizes: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    fitNotes: { type: String, maxlength: 200 },
    modelStats: { type: ModelStatsSchema },
    bundleIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    exclusive: { type: Boolean, default: false },
    colorVariants: { type: [ColorVariantSchema], default: [] },
    pressQuotes: { type: [PressQuoteSchema], default: [] },
    backInStock: { type: Boolean, default: false },
    lastLowStockAlertSentAt: { type: Date },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
