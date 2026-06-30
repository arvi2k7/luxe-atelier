"use client";

import { useState } from "react";

const REASONS = [
  { value: "wrong_size", label: "Wrong size" },
  { value: "damaged", label: "Damaged or defective" },
  { value: "not_as_described", label: "Not as described" },
  { value: "changed_mind", label: "Changed mind" },
  { value: "other", label: "Other" },
];

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  slug?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface ReturnRecord {
  _id: string;
  orderNumber: string;
  status: string;
  items: Array<{ productName: string; size: string; quantity: number; reason: string }>;
  notes?: string;
  adminNote?: string;
  createdAt: string;
}

export function ReturnPortal({ orders, returns }: { orders: Order[]; returns: ReturnRecord[] }) {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [returnItems, setReturnItems] = useState<Array<{ productName: string; size: string; quantity: number; reason: string }>>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const eligibleOrders = orders.filter((o) => o.status === "delivered");

  function handleOrderSelect(orderNumber: string) {
    setSelectedOrder(orderNumber);
    setReturnItems([]);
    const order = eligibleOrders.find((o) => o.orderNumber === orderNumber);
    if (order) {
      setReturnItems(
        order.items.map((i) => ({
          productName: i.name,
          size: i.size || "",
          quantity: 0,
          reason: "other",
        }))
      );
    }
  }

  function updateItem(index: number, field: string, value: string | number) {
    setReturnItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSubmit() {
    const selected = returnItems.filter((i) => i.quantity > 0);
    if (selected.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: selectedOrder, items: selected, notes }),
      });
      if (!res.ok) throw new Error("Failed to submit return");
      setSuccess("Return request submitted. We will review and get back to you within 2 business days.");
      setSelectedOrder("");
      setReturnItems([]);
      setNotes("");
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {success && (
        <div className="border border-green-400/30 bg-green-400/5 p-4">
          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      <div className="border border-gold/20 bg-panel p-6">
        <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold mb-4">Submit a Return</h2>

        <div>
          <label className="text-xs text-bone-muted">Select delivered order</label>
          <select
            value={selectedOrder}
            onChange={(e) => handleOrderSelect(e.target.value)}
            className="w-full border border-gold/30 bg-vitrine px-3 py-2 text-sm text-bone mt-1 focus:border-gold focus:outline-none"
          >
            <option value="">Choose an order...</option>
            {eligibleOrders.map((o) => (
              <option key={o._id} value={o.orderNumber}>
                {o.orderNumber} — {new Date(o.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {selectedOrder && returnItems.length > 0 && (
          <div className="mt-6 space-y-4">
            {returnItems.map((item, i) => (
              <div key={i} className="border border-gold/10 p-4 space-y-3">
                <p className="text-sm text-bone">{item.productName} {item.size ? `(${item.size})` : ""}</p>
                <div className="flex gap-4">
                  <div>
                    <label className="text-xs text-bone-muted">Qty to return</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 0)}
                      className="w-20 border border-gold/30 bg-transparent px-2 py-1 text-sm text-bone mt-1 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-bone-muted">Reason</label>
                    <select
                      value={item.reason}
                      onChange={(e) => updateItem(i, "reason", e.target.value)}
                      className="w-full border border-gold/30 bg-vitrine px-2 py-1 text-sm text-bone mt-1 focus:border-gold focus:outline-none"
                    >
                      {REASONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <textarea
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none h-20 resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={submitting || !returnItems.some((i) => i.quantity > 0)}
              className="border border-gold bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.12em] text-gold-bright hover:bg-gold/20 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Return Request"}
            </button>
          </div>
        )}
      </div>

      <div className="border border-gold/20 bg-panel p-6">
        <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold mb-4">Return History</h2>
        {returns.length === 0 ? (
          <p className="text-sm text-bone-muted">No return requests yet.</p>
        ) : (
          <div className="space-y-3">
            {returns.map((r) => (
              <div key={r._id} className="border border-gold/10 p-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs uppercase tracking-[0.1em] text-gold">{r.orderNumber}</p>
                  <span className={`text-xs uppercase tracking-[0.1em] ${
                    r.status === "refunded" ? "text-green-400" : r.status === "rejected" ? "text-red-400" : "text-gold-bright"
                  }`}>
                    {r.status}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {r.items.map((item, i) => (
                    <p key={i} className="text-xs text-bone-muted">
                      {item.productName} × {item.quantity} — {REASONS.find((re) => re.value === item.reason)?.label || item.reason}
                    </p>
                  ))}
                </div>
                {r.adminNote && <p className="mt-2 text-xs text-bone-muted italic">Note: {r.adminNote}</p>}
                <p className="mt-1 text-xs text-bone-muted/60">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
