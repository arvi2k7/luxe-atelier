"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { FreeShippingBar } from "./free-shipping-bar";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const syncCart = useCallback(async () => {
    try {
      await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
        credentials: "include",
      });
    } catch {
      //
    }
  }, [items]);

  useEffect(() => {
    const timer = setTimeout(syncCart, 2000);
    return () => clearTimeout(timer);
  }, [syncCart]);

  useEffect(() => {
    function handleCartToggle() {
      setOpen((prev) => !prev);
    }
    window.addEventListener("toggle-cart-drawer", handleCartToggle);
    return () => window.removeEventListener("toggle-cart-drawer", handleCartToggle);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative text-bone-muted hover:text-bone transition-colors"
        aria-label={`Cart with ${totalItems} items`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-vitrine">
            {totalItems}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[90]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-gold/20 bg-panel shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
              <h2 className="font-body text-sm uppercase tracking-[0.12em] text-bone">
                Cart ({totalItems})
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-bone-muted hover:text-bone text-lg"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="mt-16 text-center">
                  <p className="text-sm text-bone-muted">Your cart is empty.</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 inline-block border border-gold/30 px-6 py-3 text-xs uppercase tracking-[0.12em] text-gold-bright hover:bg-gold/10 transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.size}`} className="flex gap-4 border-b border-gold/10 pb-4">
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-vitrine">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col justify-between text-sm">
                        <div>
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-bone hover:text-gold-bright transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-bone-muted">{item.size}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  removeItem(item.productId, item.size);
                                } else {
                                  updateQuantity(item.productId, item.size, item.quantity - 1);
                                }
                              }}
                              className="h-6 w-6 border border-gold/20 text-bone-muted hover:text-bone text-xs"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs text-bone">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                              className="h-6 w-6 border border-gold/20 text-bone-muted hover:text-bone text-xs"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-mono text-xs text-bone">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-bone-muted hover:text-bone text-xs self-start mt-1"
                        aria-label={`Remove ${item.name}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gold/20 px-6 py-4 space-y-4">
                <FreeShippingBar subtotal={subtotal} />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-bone-muted">Subtotal</span>
                  <span className="font-mono text-gold-bright">${subtotal.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full bg-gold/10 border border-gold px-6 py-3 text-center text-xs uppercase tracking-[0.12em] text-gold-bright transition-colors hover:bg-gold/20"
                >
                  Checkout
                </Link>

                <button
                  onClick={() => { clearCart(); setOpen(false); }}
                  className="block w-full text-center text-xs text-bone-muted hover:text-bone transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
