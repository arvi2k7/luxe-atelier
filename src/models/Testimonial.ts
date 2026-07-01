import { Schema, model, models } from "mongoose";

export interface ITestimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  sortOrder: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ sortOrder: 1 });

export default models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
