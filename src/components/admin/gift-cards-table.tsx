"use client";

import { useState } from "react";

interface GiftCardData {
  _id: string;
  code: string;
  initialBalance: number;
  balance: number;
  status: string;
  recipientEmail?: string;
  senderName?: string;
  message?: string;
  expiresAt?: string;
  createdAt: string;
}

export function AdminGiftCardsTable({ cards }: { cards: GiftCardData[] }) {
  const [filter, setFilter] = useState<"all" | "active" | "redeemed" | "expired">("all");

  const filtered = filter === "all"
    ? cards
    : cards.filter((c) => c.status === filter);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {(["all", "active", "redeemed", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
              filter === f
                ? "border border-gold bg-gold/10 text-gold-bright"
                : "border border-gold/20 text-bone-muted hover:text-bone"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-xs uppercase tracking-[0.1em] text-gold">
              <th className="pb-3 pr-4">Code</th>
              <th className="pb-3 pr-4">Balance</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Recipient</th>
              <th className="pb-3 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="pt-8 text-center text-sm text-bone-muted">No gift cards found.</td>
              </tr>
            ) : (
              filtered.map((card) => (
                <tr key={card._id} className="border-b border-gold/10 text-bone-muted">
                  <td className="py-3 pr-4 font-mono text-gold-bright">{card.code}</td>
                  <td className="py-3 pr-4">${card.balance.toFixed(2)} / ${card.initialBalance.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs uppercase tracking-[0.1em] ${
                      card.status === "active" ? "text-green-400" : card.status === "redeemed" ? "text-bone-muted" : "text-bone-muted/50"
                    }`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{card.recipientEmail || "—"}</td>
                  <td className="py-3">{new Date(card.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
