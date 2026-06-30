import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import type { IUser } from "@/models/User";

export const metadata = { title: "Staff — Admin" };

export default async function AdminStaffPage() {
  await connectDB();
  const staff = await User.find({ role: { $in: ["admin", "staff"] } }).select("name email role createdAt").lean();

  return (
    <div>
      <h1 className="font-display text-2xl text-bone mb-8">Staff</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-xs uppercase tracking-[0.1em] text-gold">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3">Since</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={4} className="pt-8 text-center text-sm text-bone-muted">No staff accounts yet.</td>
              </tr>
            ) : (
              staff.map((u: IUser & { _id: string }) => (
                <tr key={String(u._id)} className="border-b border-gold/10 text-bone-muted">
                  <td className="py-3 pr-4">{u.name || "—"}</td>
                  <td className="py-3 pr-4 text-xs">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className="text-xs uppercase tracking-[0.1em] text-gold-bright">{u.role}</span>
                  </td>
                  <td className="py-3 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
