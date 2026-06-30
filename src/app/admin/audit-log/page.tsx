import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import Link from "next/link";

export const metadata = { title: "Audit Log — Admin" };

export default async function AdminAuditLogPage() {
  await connectDB();
  const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div>
      <h1 className="font-display text-2xl text-bone mb-8">Audit Log</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-xs uppercase tracking-[0.1em] text-gold">
              <th className="pb-3 pr-4">Action</th>
              <th className="pb-3 pr-4">Target</th>
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="pt-8 text-center text-sm text-bone-muted">No audit log entries yet.</td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={String(log._id)} className="border-b border-gold/10 text-bone-muted">
                  <td className="py-3 pr-4">
                    <span className="text-xs uppercase tracking-[0.1em]">{log.action}</span>
                  </td>
                  <td className="py-3 pr-4 text-xs">{log.target} {log.targetId ? `(${log.targetId})` : ""}</td>
                  <td className="py-3 pr-4 text-xs">{log.userId || "system"}</td>
                  <td className="py-3 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Link href="/admin" className="mt-6 inline-block text-xs text-bone-muted hover:text-gold-bright transition-colors">← Back to Dashboard</Link>
    </div>
  );
}
