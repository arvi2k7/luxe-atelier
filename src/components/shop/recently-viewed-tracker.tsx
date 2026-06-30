"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore, type RecentlyViewedItem } from "@/store/recently-viewed-store";

export function RecentlyViewedTracker({ product }: { product: RecentlyViewedItem }) {
  const addProduct = useRecentlyViewedStore((s) => s.addProduct);
  useEffect(() => { addProduct(product); }, [addProduct, product]);
  return null;
}
