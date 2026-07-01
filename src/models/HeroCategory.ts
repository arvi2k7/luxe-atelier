import { Schema, model, models } from "mongoose";

export interface IHeroCategory {
  key: string;
  label: string;
  sub: string;
  href: string;
  image: string;
  sortOrder: number;
}

const HeroCategorySchema = new Schema<IHeroCategory>(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    sub: { type: String, required: true },
    href: { type: String, required: true },
    image: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

HeroCategorySchema.index({ sortOrder: 1 });

export default models.HeroCategory || model<IHeroCategory>("HeroCategory", HeroCategorySchema);
