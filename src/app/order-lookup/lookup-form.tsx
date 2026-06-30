"use client";

import { useState } from "react";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

type OrderResult = {
  orderNumber: string;
  status: string;
  items: Array<{ name: string; size: string; quantity: number; price: number }>;
  subtotal: number;
  total: number;
  discount?: number;
  couponCode?: string;
  shipping: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-gold",
  processing: "text-blue-400",
  shipped: "text-purple-400",
  delivered: "text-green-400",
  cancelled: "text-red-400",
};

export function OrderLookupForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lookup failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Order number (e.g. LA-...)" className={inputClass}
          value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        <input required type="email" placeholder="Email used at checkout" className={inputClass}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full border border-gold bg-gold/10 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
          {loading ? "Looking up..." : "Look up order"}
        </button>
      </form>

      {searched && !loading && !result && !error && (
        <p className="mt-6 text-sm text-bone-muted">No order found. Check your details and try again.</p>
      )}

      {result && (
        <div className="mt-8 border border-gold/20 bg-panel p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-gold">Order</p>
              <p className="mt-1 font-display text-xl text-bone">{result.orderNumber}</p>
              <p className="text-xs text-bone-muted">
                {new Date(result.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </p>
            </div>
            <span className={`text-xs capitalize ${STATUS_COLORS[result.status] ?? "text-bone-muted"}`}>
              {result.status}
            </span>
          </div>

          <div className="border-t border-gold/20 pt-4 space-y-2">
            {result.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-bone">{item.name} ({item.size}) &times; {item.quantity}</span>
                <span className="text-bone-muted">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gold/20 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-bone-muted">
              <span>Subtotal</span>
              <span>${result.subtotal.toLocaleString()}</span>
            </div>
            {result.couponCode && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({result.couponCode})</span>
                <span>-${(result.discount ?? 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span className="text-bone">Total</span>
              <span className="text-gold-bright">${result.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-gold/20 pt-4">
            <p className="text-xs uppercase tracking-[0.12em] text-gold">Shipping to</p>
            <p className="mt-1 text-sm text-bone-muted">
              {result.shipping.fullName}<br />
              {result.shipping.addressLine1}<br />
              {result.shipping.city}, {result.shipping.state} {result.shipping.postalCode}<br />
              {result.shipping.country}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
