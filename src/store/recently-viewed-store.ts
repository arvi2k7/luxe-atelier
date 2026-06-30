"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentlyViewedItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  category: string;
};

type RecentlyViewedState = {
  items: RecentlyViewedItem[];
  addProduct: (product: RecentlyViewedItem) => void;
  clearAll: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addProduct: (product) => {
        const items = get().items.filter((i) => i.productId !== product.productId);
        set({ items: [product, ...items].slice(0, 10) });
      },
      clearAll: () => set({ items: [] }),
    }),
    { name: "luxe-atelier-recently-viewed" }
  )
);
