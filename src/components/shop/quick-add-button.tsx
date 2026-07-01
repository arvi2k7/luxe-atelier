"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";

type QuickAddProduct = {
  _id: string;
  name: string;
  price: number;
  sizes: string[];
  slug: string;
  stock: number;
};

export function QuickAddButton({ product }: { product: QuickAddProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const panelClass = "absolute bottom-0 left-0 right-0 max-md:translate-y-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-vitrine/90 backdrop-blur-sm";

  function handleAdd(size: string) {
    addItem({ productId: product._id, slug: product.slug, name: product.name, price: product.price, image: "", size, quantity: 1 });
    setSelectedSize(size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (product.stock === 0) {
    return (
      <div className={panelClass + " py-2 text-center text-xs text-bone-muted"}>
        Out of stock
      </div>
    );
  }

  if (product.sizes.length === 1) {
    return (
      <div className={panelClass}>
        <button onClick={() => handleAdd(product.sizes[0])} disabled={added}
          className="w-full py-3 md:py-2 text-xs tracking-[0.1em] text-gold-bright hover:bg-gold/10 transition-colors">
          {added ? "Added ✓" : "Quick add"}
        </button>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      {!showSizes ? (
        <button onClick={() => setShowSizes(true)}
          className="w-full py-3 md:py-2 text-xs tracking-[0.1em] text-gold-bright hover:bg-gold/10 transition-colors">
          Quick add
        </button>
      ) : (
        <div className="p-2">
          <div className="flex flex-wrap gap-1 justify-center">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => handleAdd(s)}
                className={`px-2 py-1 text-xs border transition-colors min-w-[36px] min-h-[28px] ${selectedSize === s ? "border-gold-bright text-gold-bright" : "border-gold/30 text-bone-muted hover:border-gold"}`}>
                {s}
              </button>
            ))}
          </div>
          {added && <p className="text-center text-xs text-green-400 mt-1">Added ✓</p>}
        </div>
      )}
    </div>
  );
}
