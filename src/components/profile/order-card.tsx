"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

interface OrderData {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number; slug: string }>;
}

export function ProfileOrderCard({ order }: { order: OrderData }) {
  const [reordering, setReordering] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const grandTotal = order.status === "cancelled" ? 0 : order.total;

  async function handleReorder() {
    setReordering(true);
    for (const item of order.items) {
      addItem({
        productId: item.slug,
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: "",
        size: "",
        quantity: item.quantity,
      });
    }
    await new Promise((r) => setTimeout(r, 300));
    router.push("/checkout");
  }

  return (
    <div className="border border-gold/20 bg-panel p-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-gold">{order.orderNumber}</p>
          <p className="text-xs text-bone-muted mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs uppercase tracking-[0.1em] ${
            order.status === "cancelled" ? "text-red-400" : order.status === "delivered" ? "text-green-400" : "text-gold-bright"
          }`}>
            {order.status}
          </span>
          <span className="font-mono text-sm text-bone">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-bone-muted">
            <span>{item.name} × {item.quantity}</span>
            <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        {order.status !== "cancelled" && (
          <>
            <Link
              href={`/order-lookup?orderNumber=${order.orderNumber}`}
              className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors"
            >
              View Details
            </Link>
            <button
              onClick={handleReorder}
              disabled={reordering}
              className="border border-gold bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.1em] text-gold-bright hover:bg-gold/20 transition-colors disabled:opacity-50"
            >
              {reordering ? "Adding..." : "Reorder"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
