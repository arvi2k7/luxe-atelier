import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Link from "next/link";

export default async function AdminCustomersPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  await connectDB();

  const customers = await User.aggregate([
    { $match: { role: "customer" } },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        createdAt: 1,
        orderCount: { $size: "$orders" },
        totalSpend: { $sum: "$orders.total" },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-bone">Customers</h1>
        <p className="mt-1 text-xs text-bone-muted">
          {customers.length} registered {customers.length === 1 ? "account" : "accounts"}
        </p>
      </div>

      <div className="mt-10 divide-y divide-gold/10">
        {customers.map((c: { _id: string; name: string; email: string; createdAt: string; orderCount: number; totalSpend: number }) => (
          <div key={String(c._id)} className="flex items-center justify-between py-4 gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-display text-base text-bone truncate">{c.name}</p>
              <p className="text-xs text-bone-muted">{c.email}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-bone-muted">
                {new Date(c.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-bone-muted">
                {c.orderCount} {c.orderCount === 1 ? "order" : "orders"}
              </p>
            </div>
            <div className="text-right w-24 flex-shrink-0">
              <p className="text-sm text-bone">
                ${(c.totalSpend ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <p className="py-8 text-sm text-bone-muted">No customer accounts yet.</p>
        )}
      </div>

      <div className="mt-8 border-t border-gold/10 pt-6">
        <Link href="/admin" className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
          ← Back to admin home
        </Link>
      </div>
    </div>
  );
}
