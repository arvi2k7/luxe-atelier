"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";
const labelClass = "block text-xs uppercase tracking-[0.12em] text-gold mb-1";

export default function NewCouponPage() {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", discountPercent: "", maxUses: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discountPercent: Number(form.discountPercent),
        maxUses: form.maxUses ? Number(form.maxUses) : 0,
        expiresAt: form.expiresAt || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setSaving(false);
      return;
    }

    router.push("/admin/coupons");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/coupons"
        className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
        ← Coupons
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-bone">New Coupon</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className={labelClass}>Code</label>
          <input required className={inputClass} value={form.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            placeholder="TAKE20" />
        </div>
        <div>
          <label className={labelClass}>Discount (%)</label>
          <input required type="number" min="1" max="100" className={inputClass}
            value={form.discountPercent} onChange={(e) => set("discountPercent", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Max uses (0 = unlimited)</label>
          <input type="number" min="0" className={inputClass}
            value={form.maxUses} onChange={(e) => set("maxUses", e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className={labelClass}>Expires at (optional)</label>
          <input type="date" className={inputClass}
            value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={saving}
          className="border border-gold bg-gold/10 px-6 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
          {saving ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
}
