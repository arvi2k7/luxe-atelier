"use client";

import { useState } from "react";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
    } catch {
      // Ignore
    }
    setDone(true);
    setLoading(false);
  }

  if (done) return <p className="text-sm text-green-400">You&rsquo;re on the list.</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input required type="email" placeholder="Your email" className={inputClass + " w-64"}
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" disabled={loading}
        className="border border-gold/30 px-4 py-2 text-xs tracking-[0.1em] text-bone-muted hover:border-gold hover:text-bone transition-colors disabled:opacity-50">
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
