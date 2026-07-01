import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import type { IOrderItem } from "@/models/Order";
import Link from "next/link";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  await connectDB();
  const order = await Order.findOne({ orderNumber }).lean();

  if (!order) notFound();

  const firstName = order.shipping?.fullName?.split(" ")[0] || "there";
  const displayEmail = (order as Record<string, unknown>).email || order.shipping?.email || "your email";

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 text-center md:px-10 animate-fade-up-sm">
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4C28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="text-xs uppercase tracking-[0.15em] text-gold">Order Confirmed</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-bone text-balance">
        Thank you, {firstName}.
      </h1>
      <p className="mt-4 text-sm text-bone-muted leading-relaxed max-w-md mx-auto">
        Order <span className="text-bone">{order.orderNumber}</span> has been placed.
        We&apos;ll send a confirmation to <span className="text-bone">{displayEmail}</span>.
      </p>

      {order.pointsRedeemed && (
        <p className="mt-4 inline-flex items-center gap-2 rounded border border-gold/20 bg-gold/5 px-4 py-2 text-sm text-gold-bright">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4C28F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          You earned {order.pointsRedeemed} loyalty points
        </p>
      )}

      <div className="mt-10 space-y-4 border border-gold/20 bg-panel p-6 text-left">
        {order.items?.map((item: IOrderItem, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-bone">
              {item.name}{item.size ? ` (${item.size})` : ""} &times; {item.quantity}
            </span>
            <span className="text-bone-muted">
              ${(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-gold/20 pt-4 flex justify-between text-sm font-medium">
          <span className="text-bone">Total</span>
          <span className="text-gold-bright">${order.total?.toLocaleString()}</span>
        </div>
      </div>

      <p className="mt-6 text-xs text-bone-muted leading-relaxed">
        Shipping to {order.shipping?.addressLine1}, {order.shipping?.city}, {order.shipping?.state} {order.shipping?.postalCode}, {order.shipping?.country}
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Link href="/profile/orders" className="border border-gold/30 px-6 py-3 text-xs uppercase tracking-[0.12em] text-bone-muted hover:border-gold hover:text-bone transition-colors">
          View My Orders
        </Link>
        <Link href="/shop" className="border border-gold bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.12em] text-gold-bright hover:bg-gold/20 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
