"use client";

import { useState } from "react";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 border border-gold/20 bg-panel p-6 text-center">
        <p className="text-sm text-green-400">Thank you — your review is pending approval.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border border-gold/20 bg-panel p-6">
      <p className="text-xs uppercase tracking-[0.12em] text-gold mb-4">Write a review</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-xs text-bone-muted mb-2">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)}
                className={`text-xl transition-colors ${star <= (hoveredStar || rating) ? "text-gold" : "text-gold/20"}`}>
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.12em] text-gold mb-1">Title</label>
          <input required maxLength={100} className={inputClass} value={title}
            onChange={(e) => setTitle(e.target.value)} placeholder="Summary of your review" />
          <p className="text-right text-xs text-bone-muted mt-0.5">{title.length}/100</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.12em] text-gold mb-1">Review</label>
          <textarea required maxLength={1000} rows={4} className={inputClass + " resize-none"} value={body}
            onChange={(e) => setBody(e.target.value)} placeholder="Tell others about your experience..." />
          <p className="text-right text-xs text-bone-muted mt-0.5">{body.length}/1000</p>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading}
          className="border border-gold bg-gold/10 px-6 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
