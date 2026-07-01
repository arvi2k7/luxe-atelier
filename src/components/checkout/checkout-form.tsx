"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { FreeShippingBar } from "@/components/conversion/free-shipping-bar";
import { WelcomeDiscount } from "@/components/conversion/welcome-discount";
import { getDeliveryEstimate } from "@/lib/shipping";
import { ScrollReveal } from "@/components/home/scroll-reveal";

const inputBase =
  "w-full border border-gold/30 bg-transparent px-3 py-2.5 text-sm text-bone placeholder:text-bone-muted/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-vitrine focus:ring-gold/30 transition";

const inputError =
  "border-red-400 focus:border-red-400 focus:ring-red-400/30";

type Props = {
  userName?: string | null;
  userEmail?: string | null;
};

export function CheckoutForm({ userName, userEmail }: Props) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [form, setForm] = useState({
    fullName: userName ?? "",
    email: userEmail ?? "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<{ discount: number; total: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardStatus, setGiftCardStatus] = useState<{ appliedAmount: number; balance: number } | null>(null);
  const [giftCardError, setGiftCardError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            size: i.size,
            quantity: i.quantity,
            image: i.image,
          })),
          shipping: form,
          subtotal,
          total: subtotal,
          ...(couponStatus ? { couponCode } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Order failed");
      }
      const data = await res.json();
      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:px-10">
        <p className="text-sm text-bone-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <ScrollReveal>
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-bone text-balance">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">

          <section>
            <h2 className="text-xs uppercase tracking-[0.12em] text-gold">Contact</h2>
            <div className="mt-4 space-y-4">
              <input
                required
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={inputBase}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputBase}
              />
              <input
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputBase}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.12em] text-gold">Shipping Address</h2>
            <div className="mt-4 space-y-4">
              <input
                required
                placeholder="Address line 1"
                value={form.addressLine1}
                onChange={(e) => update("addressLine1", e.target.value)}
                className={inputBase}
              />
              <input
                placeholder="Address line 2 (optional)"
                value={form.addressLine2}
                onChange={(e) => update("addressLine2", e.target.value)}
                className={inputBase}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputBase}
                />
                <input
                  required
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Postal code"
                  value={form.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  className={inputBase}
                />
                <input
                  required
                  placeholder="Country (e.g. US, GB, DE)"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className={inputBase}
                />
              </div>
              {form.country && (
                <p className="text-xs text-bone-muted">{getDeliveryEstimate(form.country)}</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.12em] text-gold">Order Summary</h2>
            <div className="mt-4 border border-gold/20 bg-panel p-5 space-y-4">
              <FreeShippingBar subtotal={subtotal} />

              <WelcomeDiscount />

              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between">
                    <span className="text-bone-muted">
                      {item.name}{item.size ? ` (${item.size})` : ""} &times; {item.quantity}
                    </span>
                    <span className="text-bone">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold/20 pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-bone-muted">Subtotal</span>
                  <span className="text-bone">${subtotal.toLocaleString()}</span>
                </div>
                {couponStatus && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount ({couponCode.toUpperCase()})</span>
                    <span>-${couponStatus.discount.toLocaleString()}</span>
                  </div>
                )}
                {giftCardStatus && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Gift card</span>
                    <span>-${giftCardStatus.appliedAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gold/20 pt-2 font-medium">
                  <span>Total</span>
                  <span className="text-gold-bright">
                    ${(couponStatus ? couponStatus.total : subtotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gold/20 pt-4 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-gold">Promo code</p>
                  <div className="mt-2 flex gap-2">
                    <input
                      placeholder="Enter code"
                      className={inputBase + " flex-1"}
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponStatus(null); }}
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
                      {couponCode.toUpperCase()} applied — ${couponStatus.discount.toLocaleString()} off
                    </p>
                  )}
                  {couponError && <p className="mt-2 text-xs text-red-400">{couponError}</p>}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-gold">Gift Card</p>
                  <div className="mt-2 flex gap-2">
                    <input
                      placeholder="Gift card code"
                      className={inputBase + " flex-1"}
                      value={giftCardCode}
                      onChange={(e) => { setGiftCardCode(e.target.value); setGiftCardStatus(null); }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        setGiftCardError("");
                        setGiftCardStatus(null);
                        try {
                          const res = await fetch("/api/gift-cards/redeem", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ code: giftCardCode, orderTotal: subtotal }),
                          });
                          if (!res.ok) {
                            const data = await res.json();
                            throw new Error(data.error || "Invalid gift card");
                          }
                          const data = await res.json();
                          setGiftCardStatus({ appliedAmount: data.appliedAmount, balance: data.balance });
                        } catch (err) {
                          setGiftCardError((err as Error).message);
                        }
                      }}
                      className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors flex-shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {giftCardStatus && (
                    <p className="mt-2 text-xs text-green-400">
                      ${giftCardStatus.appliedAmount.toFixed(2)} applied — balance ${(giftCardStatus.balance - giftCardStatus.appliedAmount).toFixed(2)}
                    </p>
                  )}
                  {giftCardError && <p className="mt-2 text-xs text-red-400">{giftCardError}</p>}
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full border border-gold bg-gold/10 py-4 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                    </svg>
                    Placing Order…
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </section>
        </form>
      </div>
    </ScrollReveal>
  );
}
