import { Schema, model, models } from "mongoose";

export interface ISavedAddress {
  userId: Schema.Types.ObjectId;
  label: string;
  isDefault: boolean;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
}

const SavedAddressSchema = new Schema<ISavedAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

SavedAddressSchema.index({ userId: 1 });

export default models.SavedAddress || model<ISavedAddress>("SavedAddress", SavedAddressSchema);
