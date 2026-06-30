"use client";

import { useState } from "react";

const inputClass = "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

export function ProfileEditor({ user }: { user: Record<string, any> }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage("Profile updated");
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-gold/20 bg-panel p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center text-lg text-gold-bright font-semibold">
          {(user.name || "U")[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-bone">{user.name || "Unnamed"}</p>
          <p className="text-xs text-bone-muted">{user.email}</p>
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-gold">Name</label>
        <input className={inputClass + " mt-1"} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-gold">Bio</label>
        <textarea className={inputClass + " mt-1 h-20 resize-none"} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      {message && <p className="text-xs text-bone-muted">{message}</p>}
      <button onClick={handleSave} disabled={saving}
        className="border border-gold bg-gold/10 px-6 py-2 text-xs uppercase tracking-[0.12em] text-gold-bright hover:bg-gold/20 transition-colors disabled:opacity-50">
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
