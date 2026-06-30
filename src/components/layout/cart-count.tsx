"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";

export function CartCount() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

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
