"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:px-10">
        <h1 className="font-display text-3xl font-semibold text-bone">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block text-sm text-gold-bright underline"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone">
        Cart
      </h1>

      <div className="mt-10 space-y-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex items-center justify-between border-b border-gold/10 pb-6"
          >
            <div>
              <p className="font-display text-lg text-bone">{item.name}</p>
              <p className="text-xs text-bone-muted">Size {item.size}</p>
              <button
                onClick={() => removeItem(item.productId, item.size)}
                className="mt-2 text-xs text-bone-muted underline hover:text-bone"
              >
                Remove
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gold/30">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))
                  }
                  className="px-3 py-1 text-bone-muted hover:text-bone"
                >
                  -
                </button>
                <span className="px-3 text-sm text-bone">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.size, item.quantity + 1)
                  }
                  className="px-3 py-1 text-bone-muted hover:text-bone"
                >
                  +
                </button>
              </div>
              <span className="w-20 text-right text-sm text-bone">
                ${(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <span className="font-body text-sm text-bone-muted">Subtotal</span>
        <span className="font-display text-2xl text-bone">
          ${subtotal.toLocaleString()}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-8 block w-full border border-gold bg-gold/10 py-4 text-center text-sm tracking-[0.1em] text-gold-bright transition-colors hover:bg-gold/20"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
