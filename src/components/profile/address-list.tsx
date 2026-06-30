"use client";

import { useState } from "react";

const inputClass = "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

interface Address {
  _id: string;
  label?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export function AddressList({ addresses: initial }: { addresses: Address[] }) {
  const [addresses, setAddresses] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm({
      label: "", fullName: "", addressLine1: "", addressLine2: "",
      city: "", state: "", postalCode: "", country: "", phone: "",
    });
  }

  async function handleSave(id?: string) {
    setSaving(true);
    try {
      const isDefault = !addresses.some((a) => a.isDefault) || addresses.length === 0;
      const body = { ...form, isDefault };

      if (id) {
        const res = await fetch(`/api/addresses/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        id = data.id;
      }

      const res = await fetch("/api/addresses");
      const updated = await res.json();
      setAddresses(updated);
      setAdding(false);
      setEditingId(null);
      resetForm();
    } catch {
      //
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch {
      //
    }
  }

  function startEdit(addr: Address) {
    setEditingId(addr._id);
    setForm({
      label: addr.label || "",
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || "",
    });
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div key={addr._id} className="border border-gold/20 bg-panel p-4">
          {editingId === addr._id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Label (e.g. Home)" className={inputClass} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                <input placeholder="Full Name" className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <input placeholder="Address Line 1" className={inputClass} value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
              <input placeholder="Address Line 2 (optional)" className={inputClass} value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City" className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <input placeholder="State" className={inputClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Postal Code" className={inputClass} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                <input placeholder="Country" className={inputClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <input placeholder="Phone" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={() => handleSave(addr._id)} disabled={saving}
                  className="border border-gold bg-gold/10 px-4 py-2 text-xs text-gold-bright hover:bg-gold/20 transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setEditingId(null); resetForm(); }}
                  className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:text-bone transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                {addr.label && <p className="text-xs uppercase tracking-[0.1em] text-gold mb-1">{addr.label}</p>}
                <p className="text-sm text-bone">{addr.fullName}</p>
                <p className="text-sm text-bone-muted">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                <p className="text-sm text-bone-muted">{addr.city}, {addr.state} {addr.postalCode}</p>
                <p className="text-sm text-bone-muted">{addr.country}{addr.phone ? ` — ${addr.phone}` : ""}</p>
                {addr.isDefault && <span className="mt-1 inline-block text-xs text-gold-bright">Default</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(addr)}
                  className="text-xs text-bone-muted hover:text-gold-bright transition-colors">Edit</button>
                <button onClick={() => handleDelete(addr._id)}
                  className="text-xs text-bone-muted hover:text-red-400 transition-colors">Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <div className="border border-gold/20 bg-panel p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Label (e.g. Home)" className={inputClass} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            <input placeholder="Full Name" className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <input placeholder="Address Line 1" className={inputClass} value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
          <input placeholder="Address Line 2 (optional)" className={inputClass} value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="State" className={inputClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Postal Code" className={inputClass} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            <input placeholder="Country" className={inputClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <input placeholder="Phone" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={() => handleSave()} disabled={saving}
              className="border border-gold bg-gold/10 px-4 py-2 text-xs text-gold-bright hover:bg-gold/20 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Add"}
            </button>
            <button onClick={() => { setAdding(false); resetForm(); }}
              className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:text-bone transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => { resetForm(); setAdding(true); }}
          className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors">
          Add Address
        </button>
      )}
    </div>
  );
}
