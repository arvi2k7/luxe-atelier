"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productId === item.productId && i.size === item.size
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        });
      },
      updateQuantity: (productId, size, quantity) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: "luxe-atelier-cart" }
  )
);
