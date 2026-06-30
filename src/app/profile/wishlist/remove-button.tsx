"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RemoveWishlistButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleRemove() {
    setBusy(true);
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    localStorage.removeItem(`wishlist-${productId}`);
    router.refresh();
  }

  return (
    <button onClick={handleRemove} disabled={busy}
      className="text-xs text-bone-muted hover:text-red-400 transition-colors flex-shrink-0">
      {busy ? "..." : "Remove"}
    </button>
  );
}
