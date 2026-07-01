"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { FreeShippingBar } from "@/components/conversion/free-shipping-bar";
import { WelcomeDiscount } from "@/components/conversion/welcome-discount";
import { useState } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<{ discount: number; total: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function applyCoupon() {
    setCouponError("");
    setCouponStatus(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid coupon");
      }
      const data = await res.json();
      setCouponStatus({ discount: data.discount, total: data.total });
    } catch (err) {
      setCouponError((err as Error).message);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pb-24 text-center md:px-10">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A39C8C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <h1 className="mt-6 font-display text-3xl font-semibold text-bone">Your cart is empty</h1>
        <p className="mt-2 text-sm text-bone-muted">Add something beautiful to get started.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-gold/30 px-8 py-3 text-xs uppercase tracking-[0.12em] text-gold-bright transition-colors hover:bg-gold/10"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16 md:px-10">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone text-balance">
        Cart
      </h1>

      <WelcomeDiscount />
      <FreeShippingBar subtotal={subtotal} className="mt-6" />

      <div className="mt-10 space-y-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex gap-4 border-b border-gold/10 pb-6"
          >
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-vitrine">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-bone-muted/30 text-xs">—</div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/shop/${item.slug}`}
                  className="font-display text-lg text-bone hover:text-gold-bright transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-bone-muted">Size {item.size}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gold/30">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-1 text-bone-muted hover:text-bone text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-bone">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.quantity + 1)
                      }
                      className="px-3 py-1 text-bone-muted hover:text-bone text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-xs text-bone-muted underline hover:text-bone"
                  >
                    Remove
                  </button>
                </div>
                <span className="font-mono text-sm text-bone">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border border-gold/20 bg-panel p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-gold">Promo code</p>
        <div className="mt-2 flex gap-2">
          <input
            placeholder="Enter code"
            value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value); setCouponStatus(null); }}
            className="flex-1 border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-vitrine focus:ring-gold/30 transition"
          />
          <button
            type="button"
            onClick={applyCoupon}
            className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors flex-shrink-0"
          >
            Apply
          </button>
        </div>
        {couponStatus && (
          <p className="mt-2 text-xs text-green-400">
            {couponCode.toUpperCase()} applied — discount ${couponStatus.discount.toLocaleString()}
          </p>
        )}
        {couponError && <p className="mt-2 text-xs text-red-400">{couponError}</p>}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gold/20 pt-6">
        <span className="font-body text-sm text-bone-muted">Subtotal</span>
        <span className="font-display text-2xl text-bone">
          ${(couponStatus ? couponStatus.total : subtotal).toLocaleString()}
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
