"use client";

import { useState } from "react";

export function PreferencesForm({ user }: { user: { emailPreferences?: { marketing?: boolean; orderUpdates?: boolean }; name?: string; email?: string } }) {
  const [marketing, setMarketing] = useState(user.emailPreferences?.marketing ?? true);
  const [orderUpdates, setOrderUpdates] = useState(user.emailPreferences?.orderUpdates ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketing, orderUpdates }),
      });
      if (!res.ok) throw new Error();
      setMessage("Preferences saved");
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-gold/20 bg-panel p-6 space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)}
          className="h-4 w-4 accent-gold" />
        <span className="text-sm text-bone-muted">Marketing emails (new arrivals, exclusive offers)</span>
      </label>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={orderUpdates} onChange={(e) => setOrderUpdates(e.target.checked)}
          className="h-4 w-4 accent-gold" />
        <span className="text-sm text-bone-muted">Order updates (shipping, delivery, returns)</span>
      </label>

      {message && <p className="text-xs text-bone-muted">{message}</p>}

      <button onClick={handleSave} disabled={saving}
        className="border border-gold bg-gold/10 px-6 py-2 text-xs uppercase tracking-[0.12em] text-gold-bright hover:bg-gold/20 transition-colors disabled:opacity-50">
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
