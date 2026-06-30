"use client";

import { useState } from "react";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

export function NotifyMeForm({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/products/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-6 border border-gold/20 bg-panel p-4">
        <p className="text-sm text-green-400">You will be notified when this item is back in stock.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border border-gold/20 bg-panel p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-gold">Notify me</p>
      <p className="mt-1 text-xs text-bone-muted">Get an email when this item is back in stock.</p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input required type="email" placeholder="Your email" className={inputClass + " flex-1"}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" disabled={loading}
          className="border border-gold/30 px-3 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors flex-shrink-0">
          {loading ? "..." : "Subscribe"}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
