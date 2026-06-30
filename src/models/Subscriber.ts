import { Schema, model, models } from "mongoose";

export interface ISubscriber {
  email: string;
  source: string;
  active: boolean;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    source: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Subscriber || model<ISubscriber>("Subscriber", SubscriberSchema);
