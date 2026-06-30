"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StockEditor({
  productId,
  currentStock,
}: {
  productId: string;
  currentStock: number;
}) {
  const router = useRouter();
  const [stock, setStock] = useState(String(currentStock));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const num = parseInt(stock, 10);
    if (isNaN(num) || num < 0) return;
    setSaving(true);
    await fetch(`/api/admin/inventory/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: num }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => { setStock(e.target.value); setSaved(false); }}
        className="w-20 border border-gold/30 bg-transparent px-2 py-1 text-sm text-bone focus:border-gold focus:outline-none text-right"
      />
      <button
        onClick={handleSave}
        disabled={saving || String(currentStock) === stock}
        className="text-xs border border-gold/30 px-3 py-1 text-bone-muted hover:border-gold hover:text-bone transition-colors disabled:opacity-40"
      >
        {saved ? "Saved" : saving ? "..." : "Save"}
      </button>
    </div>
  );
}
