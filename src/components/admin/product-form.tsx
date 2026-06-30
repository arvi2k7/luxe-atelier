"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export type ProductFormData = {
  _id?: string;
  name: string;
  description: string;
  price: number | "";
  compareAtPrice: number | "";
  category: string;
  sizes: string[];
  stock: number | "";
  lowStockThreshold: number | "";
  featured: boolean;
  images: string[];
};

const CATEGORIES = ["Outerwear", "Evening", "Accessories", "Archive"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "One Size"];

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";
const labelClass = "block text-xs uppercase tracking-[0.12em] text-gold mb-1";

type Props = {
  initial?: ProductFormData;
  mode: "create" | "edit";
};

export function ProductForm({ initial, mode }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormData>(
    initial ?? {
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      category: "Outerwear",
      sizes: [],
      stock: "",
      lowStockThreshold: 5,
      featured: false,
      images: [],
    }
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof ProductFormData, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleSize(s: string) {
    set(
      "sizes",
      form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set("images", [...form.images, data.url]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(url: string) {
    set("images", form.images.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice !== "" ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
    };

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${form._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className={labelClass}>Name</label>
        <input required className={inputClass} value={form.name}
          onChange={(e) => set("name", e.target.value)} placeholder="Product name" />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea required rows={3} className={inputClass + " resize-none"} value={form.description}
          onChange={(e) => set("description", e.target.value)} placeholder="One or two lines" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price ($)</label>
          <input required type="number" min="0" step="0.01" className={inputClass}
            value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className={labelClass}>Compare-at price ($)</label>
          <input type="number" min="0" step="0.01" className={inputClass}
            value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} placeholder="Optional" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select className={inputClass + " bg-panel"} value={form.category}
          onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Sizes</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {ALL_SIZES.map((s) => (
            <button type="button" key={s} onClick={() => toggleSize(s)}
              className={`border px-3 py-1 text-xs transition-colors ${
                form.sizes.includes(s)
                  ? "border-gold-bright text-gold-bright"
                  : "border-gold/30 text-bone-muted hover:border-gold"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Stock</label>
          <input required type="number" min="0" className={inputClass}
            value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className={labelClass}>Low stock threshold</label>
          <input required type="number" min="0" className={inputClass}
            value={form.lowStockThreshold} onChange={(e) => set("lowStockThreshold", e.target.value)} placeholder="5" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="accent-gold" />
        <label htmlFor="featured" className="text-sm text-bone-muted">Featured on homepage</label>
      </div>

      <div>
        <label className={labelClass}>Images</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {form.images.map((url) => (
            <div key={url} className="relative group">
              <Image src={url} alt="" width={96} height={96} className="h-24 w-24 object-cover border border-gold/20" />
              <button type="button" onClick={() => removeImage(url)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-bone opacity-0 group-hover:opacity-100 transition-opacity">
                Remove
              </button>
            </div>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload}
          className="mt-3 text-xs text-bone-muted file:mr-3 file:border file:border-gold/30 file:bg-transparent file:px-3 file:py-1 file:text-xs file:text-bone-muted" />
        {uploading && <p className="mt-1 text-xs text-bone-muted">Uploading...</p>}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={saving}
        className="border border-gold bg-gold/10 px-6 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
        {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
      </button>
    </form>
  );
}
