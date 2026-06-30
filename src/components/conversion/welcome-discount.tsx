"use client";

import { useCartStore } from "@/store/cart-store";

export function WelcomeDiscount() {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (subtotal === 0) return null;

  return (
    <div className="border border-gold/20 bg-gold/5 px-6 py-4 text-center">
      <p className="text-xs uppercase tracking-[0.12em] text-gold-bright">
        First order? Use <span className="font-mono">WELCOME10</span> for 10% off
      </p>
    </div>
  );
}
