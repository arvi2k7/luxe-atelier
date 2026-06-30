import { Schema, model, models } from "mongoose";

export interface IEmailPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  backInStock: boolean;
  wishlistReminders: boolean;
  newsletter: boolean;
}

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "staff" | "customer";
  avatarUrl?: string;
  bio?: string;
  twoFactorEnabled: boolean;
  totpSecret?: string;
  emailPreferences: IEmailPreferences;
  savedSizes?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const EmailPreferencesSchema = new Schema<IEmailPreferences>(
  {
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    backInStock: { type: Boolean, default: true },
    wishlistReminders: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff", "customer"], default: "customer" },
    avatarUrl: { type: String },
    bio: { type: String, maxlength: 200 },
    twoFactorEnabled: { type: Boolean, default: false },
    totpSecret: { type: String },
    emailPreferences: { type: EmailPreferencesSchema, default: () => ({}) },
    savedSizes: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
