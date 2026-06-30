import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

export async function logAction({
  adminUserId, adminEmail, action, targetType, targetId, before, after, ip,
}: {
  adminUserId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ip?: string;
}) {
  await connectDB();
  await AuditLog.create({ adminUserId, adminEmail, action, targetType, targetId, before, after, ip });
}
