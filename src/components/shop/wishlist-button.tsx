"use client";

import { useState } from "react";

export function WishlistButton({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (isWishlisted) {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setIsWishlisted(false);
          localStorage.removeItem(`wishlist-${productId}`);
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setIsWishlisted(true);
          localStorage.setItem(`wishlist-${productId}`, "true");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs border px-3 py-1.5 transition-colors ${
        isWishlisted
          ? "border-gold-bright text-gold-bright"
          : "border-gold/30 text-bone-muted hover:border-gold hover:text-bone"
      }`}
    >
      {loading ? "..." : isWishlisted ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
}
