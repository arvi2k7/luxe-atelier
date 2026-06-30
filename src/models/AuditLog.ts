import { Schema, model, models } from "mongoose";

export interface IAuditLog {
  adminUserId: Schema.Types.ObjectId;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ip?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    ip: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
AuditLogSchema.index({ adminUserId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ targetType: 1 });

export default models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
