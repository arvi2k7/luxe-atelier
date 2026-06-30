"use client";

import { useState } from "react";

interface ReturnData {
  _id: string;
  orderNumber: string;
  userId?: { name?: string; email?: string };
  items: Array<{ productName: string; size: string; quantity: number; reason: string }>;
  notes?: string;
  status: string;
  adminNote?: string;
  refundAmount?: number;
  createdAt: string;
}

const STATUS_FLOW = ["submitted", "approved", "rejected", "received", "refunded"];

export function AdminReturnsTable({ returns: initial }: { returns: ReturnData[] }) {
  const [list, setList] = useState(initial);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/returns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setList((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
      }
    } catch {
      //
    }
  }

  function nextStatus(current: string): string | null {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gold/20 text-xs uppercase tracking-[0.1em] text-gold">
            <th className="pb-3 pr-4">Order</th>
            <th className="pb-3 pr-4">Customer</th>
            <th className="pb-3 pr-4">Items</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={5} className="pt-8 text-center text-sm text-bone-muted">No returns yet.</td>
            </tr>
          ) : (
            list.map((r) => {
              const next = nextStatus(r.status);
              return (
                <tr key={r._id} className="border-b border-gold/10 text-bone-muted">
                  <td className="py-3 pr-4 text-xs">{r.orderNumber}</td>
                  <td className="py-3 pr-4 text-xs">{r.userId?.name || r.userId?.email || "—"}</td>
                  <td className="py-3 pr-4 text-xs">{r.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs uppercase tracking-[0.1em] ${
                      r.status === "refunded" ? "text-green-400" : r.status === "rejected" ? "text-red-400" : "text-gold-bright"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {next && (
                      <button onClick={() => updateStatus(r._id, next)} className="text-xs text-gold-bright hover:underline">
                        Mark {next}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
