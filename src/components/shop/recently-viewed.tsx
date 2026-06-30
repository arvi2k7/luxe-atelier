"use client";

import Link from "next/link";
import Image from "next/image";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const items = useRecentlyViewedStore((s) => s.items)
    .filter((i) => i.productId !== currentProductId);

  if (items.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gold/20 pt-12">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-bone">Recently viewed</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
        {items.map((item) => (
          <Link key={item.productId} href={`/shop/${item.slug}`}
            className="flex-shrink-0 w-40 snap-start group">
            <div className="aspect-[3/4] overflow-hidden bg-panel">
              {item.image ? (
                <Image src={item.image} alt={item.name} width={160} height={213}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-panel via-vitrine to-black" />
              )}
            </div>
            <p className="mt-2 text-sm text-bone truncate">{item.name}</p>
            <p className="text-xs text-bone-muted">${item.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
