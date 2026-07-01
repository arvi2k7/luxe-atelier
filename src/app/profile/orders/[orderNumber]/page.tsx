import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import type { IOrderItem } from "@/models/Order";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending:    "text-gold",
  processing: "text-blue-400",
  shipped:    "text-purple-400",
  delivered:  "text-green-400",
  cancelled:  "text-red-400",
};

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user?.id;
  const { orderNumber } = await params;

  await connectDB();
  const order = await Order.findOne({ orderNumber }).lean();

  if (!order) notFound();
  if (String(order.userId) !== userId) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 md:px-10">
      <Link href="/profile"
        className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
        ← Back to your orders
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold">Order</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-bone">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-xs text-bone-muted">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        </div>
        <span className={`text-xs capitalize ${STATUS_COLORS[order.status] ?? "text-bone-muted"}`}>
          {order.status}
        </span>
      </div>

      <div className="mt-8 border border-gold/20 bg-panel p-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.12em] text-gold mb-4">Items</p>
        {order.items.map((item: IOrderItem & { _id?: string }, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-bone">
              {item.name} ({item.size}) &times; {item.quantity}
            </span>
            <span className="text-bone-muted">
              ${(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-gold/20 pt-3 flex justify-between text-sm font-medium">
          <span className="text-bone">Total</span>
          <span className="text-gold-bright">${order.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 border border-gold/20 bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-gold mb-4">Shipping</p>
        <div className="space-y-1 text-sm text-bone-muted">
          <p className="text-bone">{order.shipping.fullName}</p>
          <p>{order.shipping.email}</p>
          <p>{order.shipping.phone}</p>
          <p>{order.shipping.addressLine1}</p>
          {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
          <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}</p>
          <p>{order.shipping.country}</p>
        </div>
      </div>
    </div>
  );
}
