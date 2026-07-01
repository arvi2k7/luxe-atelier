"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  sizes: string[];
  inStock: boolean;
  stock: number;
  lowStockThreshold: number;
};

export function AddToCart({
  productId,
  slug,
  name,
  price,
  sizes,
  inStock,
  stock,
  lowStockThreshold,
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    if (!selectedSize) return;
    addItem({
      productId,
      slug,
      name,
      price,
      image: "",
      size: selectedSize,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div>
      <div className="mt-8">
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`border px-4 py-2 text-xs transition-colors ${
                selectedSize === s
                  ? "border-gold-bright text-gold-bright"
                  : "border-gold/30 text-bone-muted hover:border-gold hover:text-bone"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="mt-2 text-xs text-bone-muted">Select a size</p>
        )}
      </div>

      <button
        disabled={!inStock || !selectedSize}
        onClick={handleAdd}
        className={`mt-10 w-full border py-4 text-sm tracking-[0.1em] transition-all duration-200 ${
          !inStock || !selectedSize
            ? "border-bone-muted/20 text-bone-muted/40 cursor-not-allowed"
            : added
              ? "border-green-500/50 bg-green-500/10 text-green-400"
              : "border-gold bg-gold/10 text-gold-bright hover:bg-gold/20"
        }`}
      >
        {!inStock ? "Out of Stock" : added ? "Added to bag" : "Add to Cart"}
      </button>

      {inStock && stock <= lowStockThreshold && (
        <p className="mt-3 text-xs text-gold-bright">Only {stock} left.</p>
      )}
    </div>
  );
}
