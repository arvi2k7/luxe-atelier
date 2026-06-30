"use client";

import { useState, useEffect } from "react";

type Testimonial = {
  _id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  sortOrder: number;
};

export function AdminTestimonialEditor() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function update(i: number, field: "name" | "location" | "text" | "rating", value: string | number) {
    setItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function add() {
    setItems((prev) => [...prev, { _id: "", name: "", location: "", text: "", rating: 5, sortOrder: prev.length }]);
  }

  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const payload = items.map(({ name, location, text, rating, _id }) => ({
      _id: _id || undefined,
      name,
      location,
      text,
      rating,
    }));

    const res = await fetch("/api/admin/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save.");
      setSaving(false);
      return;
    }

    const updated = await res.json();
    setItems(updated);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="border border-gold/20 bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-gold">Testimonials</p>
        <p className="mt-2 text-xs text-bone-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="border border-gold/20 bg-panel p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.12em] text-gold">Testimonials</p>
        <button type="button" onClick={add}
          className="border border-gold/30 px-3 py-1 text-[10px] tracking-[0.1em] text-bone-muted hover:border-gold hover:text-bone transition-colors">
          + Add
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((t, i) => (
          <div key={i} className="relative border border-gold/10 bg-black/20 p-4">
            <button type="button" onClick={() => remove(i)}
              className="absolute right-2 top-2 text-[10px] text-red-400 hover:text-red-300">
              Remove
            </button>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] text-bone-muted">Name</label>
                <input type="text" value={t.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  className="mt-1 w-full border-b border-gold/20 bg-transparent px-0 py-0.5 text-xs text-bone focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] text-bone-muted">Location</label>
                <input type="text" value={t.location}
                  onChange={(e) => update(i, "location", e.target.value)}
                  className="mt-1 w-full border-b border-gold/20 bg-transparent px-0 py-0.5 text-xs text-bone focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] text-bone-muted">Rating</label>
                <select value={t.rating}
                  onChange={(e) => update(i, "rating", Number(e.target.value))}
                  className="mt-1 w-full border-b border-gold/20 bg-transparent px-0 py-0.5 text-xs text-bone focus:border-gold focus:outline-none">
                  {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-[10px] uppercase tracking-[0.1em] text-bone-muted">Text</label>
              <textarea rows={2} value={t.text}
                onChange={(e) => update(i, "text", e.target.value)}
                className="mt-1 w-full border-b border-gold/20 bg-transparent px-0 py-0.5 text-xs text-bone placeholder:text-bone-muted/40 focus:border-gold focus:outline-none resize-none" />
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <button type="button" disabled={saving} onClick={handleSave}
        className="mt-4 border border-gold bg-gold/10 px-4 py-2 text-xs tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
        {saving ? "Saving..." : "Save Testimonials"}
      </button>
    </div>
  );
}
