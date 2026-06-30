"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/store/cart-store";

export function CartCount() {
  const items = useCartStore((s) => s.items);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="font-body text-sm tracking-[0.05em] text-bone-muted transition-colors hover:text-gold-bright"
    >
      Cart ({count})
    </Link>
  );
}
