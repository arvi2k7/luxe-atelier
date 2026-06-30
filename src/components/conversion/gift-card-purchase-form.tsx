"use client";

import { useState } from "react";

const AMOUNTS = [25, 50, 75, 100, 150, 200];
const inputClass = "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

export function GiftCardPurchaseForm() {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || finalAmount < 5) {
      setError("Minimum gift card amount is $5");
      return;
    }
    if (!recipientEmail) {
      setError("Recipient email is required");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/gift-cards/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          recipientEmail,
          senderName,
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Purchase failed");
      }
      const data = await res.json();
      setSuccess(`Gift card created! Code: ${data.code}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-gold mb-3">Choose amount</p>
        <div className="flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`px-5 py-3 text-sm border transition-colors ${
                amount === a && !customAmount
                  ? "border-gold bg-gold/10 text-gold-bright"
                  : "border-gold/30 text-bone-muted hover:border-gold hover:text-bone"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-bone-muted">Custom:</span>
          <span className="text-sm text-gold">$</span>
          <input
            type="number"
            min={5}
            placeholder="Other amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className={inputClass + " w-32"}
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-gold">Recipient email *</label>
        <input required type="email" className={inputClass + " mt-2"} placeholder="friend@email.com"
          value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-gold">Your name</label>
        <input className={inputClass + " mt-2"} placeholder="From..."
          value={senderName} onChange={(e) => setSenderName(e.target.value)} />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-gold">Message (optional)</label>
        <textarea className={inputClass + " mt-2 h-24 resize-none"} placeholder="Write a short note..."
          value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-green-400">{success}</p>}

      <button type="submit" disabled={submitting}
        className="w-full border border-gold bg-gold/10 py-4 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
        {submitting ? "Creating..." : `Purchase $${finalAmount || 0} Gift Card`}
      </button>
    </form>
  );
}
