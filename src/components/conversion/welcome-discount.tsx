"use client";

import { useCartStore } from "@/store/cart-store";

export function WelcomeDiscount() {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (subtotal === 0) return null;

  return (
    <div className="border border-gold/20 bg-gold/5 px-5 py-4">
      <p className="text-xs text-bone-muted">First order?</p>
      <p className="mt-0.5 text-sm text-gold-bright">
        Use <span className="font-mono">WELCOME10</span> for 10% off
      </p>
    </div>
  );
}
