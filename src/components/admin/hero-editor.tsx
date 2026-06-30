"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type HeroCategory = {
  _id: string;
  key: string;
  label: string;
  sub: string;
  href: string;
  image: string;
  sortOrder: number;
};

export function AdminHeroEditor() {
  const [categories, setCategories] = useState<HeroCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch("/api/admin/hero-categories")
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function update(key: string, field: "label" | "sub", value: string) {
    setCategories((prev) => prev.map((c) => (c.key === key ? { ...c, [field]: value } : c)));
  }

  async function uploadImage(key: string, file: File) {
    setUploadingKey(key);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: fd }
      );
      const data = await res.json();

      if (data.secure_url) {
        setCategories((prev) => prev.map((c) => (c.key === key ? { ...c, image: data.secure_url } : c)));
        setUploadingKey(null);
        if (fileRefs.current[key]) fileRefs.current[key]!.value = "";
        return;
      }
      throw new Error(data.error?.message || data.error || "Upload failed");
    } catch {
      try {
        const proxy = new FormData();
        proxy.append("file", file);
        const fallback = await fetch("/api/upload", { method: "POST", body: proxy });
        if (fallback.ok) {
          const fallbackData = await fallback.json();
          if (fallbackData.url) {
            setCategories((prev) => prev.map((c) => (c.key === key ? { ...c, image: fallbackData.url } : c)));
            setUploadingKey(null);
            if (fileRefs.current[key]) fileRefs.current[key]!.value = "";
            return;
          }
        }
        const msg = fallback.status === 500
          ? "Server upload failed — Cloudinary keys may not be configured."
          : await fallback.text().catch(() => "Upload failed");
        setError(typeof msg === "string" ? msg : "Upload failed");
      } catch {
        setError("Image upload failed. Check your Cloudinary configuration.");
      }
    }

    setUploadingKey(null);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const payload = categories.map(({ key, label, sub, href, image }) => ({
      key, label, sub, href, image,
    }));

    const res = await fetch("/api/admin/hero-categories", {
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
    setCategories(updated);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="border border-gold/20 bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-gold">Hero Categories</p>
        <p className="mt-2 text-xs text-bone-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="border border-gold/20 bg-panel p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.12em] text-gold">Hero Categories</p>
        <p className="text-[10px] text-bone-muted">Homepage shop windows</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((cat) => (
          <div key={cat.key} className="border border-gold/10 bg-black/20 p-3">
            <div className="relative aspect-[4/3] overflow-hidden border border-gold/10 bg-black/40">
              {cat.image ? (
                <Image src={cat.image} alt={cat.label} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-[10px] text-bone-muted">No image</span>
                </div>
              )}
              {uploadingKey === cat.key && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-[10px] text-bone-muted">Uploading...</span>
                </div>
              )}
            </div>

            <input
              type="text"
              value={cat.label}
              onChange={(e) => update(cat.key, "label", e.target.value)}
              className="mt-2 w-full border-b border-gold/20 bg-transparent px-0 py-0.5 text-xs text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none"
            />
            <input
              type="text"
              value={cat.sub}
              onChange={(e) => update(cat.key, "sub", e.target.value)}
              className="mt-1 w-full border-b border-gold/20 bg-transparent px-0 py-0.5 text-[10px] text-bone-muted placeholder:text-bone-muted/40 focus:border-gold focus:outline-none"
            />

            <input
              ref={(el) => { fileRefs.current[cat.key] = el; }}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(cat.key, file);
              }}
              className="mt-2 w-full text-[10px] text-bone-muted file:mr-2 file:border file:border-gold/30 file:bg-transparent file:px-2 file:py-0.5 file:text-[10px] file:text-bone-muted"
            />
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="mt-4 border border-gold bg-gold/10 px-4 py-2 text-xs tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save Hero Categories"}
      </button>
    </div>
  );
}
