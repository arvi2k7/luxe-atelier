import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import type { IOrder } from "@/models/Order";
import { ExportOrdersButton } from "@/components/admin/export-orders-button";

const STATUS_COLORS: Record<string, string> = {
  pending:    "text-gold",
  processing: "text-blue-400",
  shipped:    "text-purple-400",
  delivered:  "text-green-400",
  cancelled:  "text-red-400",
};

type SearchParams = { status?: string };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { status } = await searchParams;
  await connectDB();

  const filter = status ? { status } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="mx-auto max-w-5xl px-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-bone">Orders</h1>
        </div>
        <ExportOrdersButton />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/orders"
          className={`px-3 py-1 text-xs border transition-colors ${
            !status ? "border-gold-bright text-gold-bright" : "border-gold/30 text-bone-muted hover:border-gold"
          }`}>
          All
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`}
            className={`px-3 py-1 text-xs border transition-colors capitalize ${
              status === s ? "border-gold-bright text-gold-bright" : "border-gold/30 text-bone-muted hover:border-gold"
            }`}>
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-8 divide-y divide-gold/10">
        {orders.map((o: IOrder & { _id: string })  => (
          <div key={String(o._id)} className="flex items-center justify-between py-4 gap-4">
            <div className="min-w-0">
              <p className="font-body text-sm text-bone">{o.orderNumber}</p>
              <p className="text-xs text-bone-muted mt-0.5">
                {o.shipping.fullName} · {o.items.length} {o.items.length === 1 ? "item" : "items"} · ${o.total.toLocaleString()}
              </p>
              <p className="text-xs text-bone-muted">
                {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className={`text-xs capitalize ${STATUS_COLORS[o.status] ?? "text-bone-muted"}`}>
                {o.status}
              </span>
              <Link href={`/admin/orders/${o._id}`}
                className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
                View
              </Link>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="py-8 text-sm text-bone-muted">No orders match that filter.</p>
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
