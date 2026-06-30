"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: low → high", value: "price_asc" },
  { label: "Price: high → low", value: "price_desc" },
];

const categories = ["Outerwear", "Evening", "Accessories", "Archive"];
const sizes = ["XS", "S", "M", "L", "XL", "One Size"];
const priceRanges = [
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 \u2013 $1000", min: 500, max: 1000 },
  { label: "$1000 \u2013 $2000", min: 1000, max: 2000 },
  { label: "$2000+", min: 2000, max: undefined as number | undefined },
];

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const activeSize = searchParams.get("size");
  const activeMin = searchParams.get("minPrice");
  const activeSort = searchParams.get("sort");

  return (
    <aside className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Sort</p>
        <ul className="mt-3 space-y-2">
          {sortOptions.map((o) => (
            <li key={o.value}>
              <button
                onClick={() => updateParam("sort", o.value)}
                className={`text-sm transition-colors ${
                  activeSort === o.value ? "text-gold-bright" : "text-bone-muted hover:text-bone"
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Category</p>
        <ul className="mt-3 space-y-2">
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() => updateParam("category", c)}
                className={`text-sm transition-colors ${
                  activeCategory === c ? "text-gold-bright" : "text-bone-muted hover:text-bone"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Price</p>
        <ul className="mt-3 space-y-2">
          {priceRanges.map((r) => {
            const isActive = activeMin === String(r.min);
            return (
              <li key={r.label}>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (isActive) {
                      params.delete("minPrice");
                      params.delete("maxPrice");
                    } else {
                      params.set("minPrice", String(r.min));
                      if (r.max !== undefined) params.set("maxPrice", String(r.max));
                      else params.delete("maxPrice");
                    }
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className={`text-sm transition-colors ${
                    isActive ? "text-gold-bright" : "text-bone-muted hover:text-bone"
                  }`}
                >
                  {r.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Size</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <li key={s}>
              <button
                onClick={() => updateParam("size", s)}
                className={`border px-3 py-1 text-xs transition-colors ${
                  activeSize === s
                    ? "border-gold-bright text-gold-bright"
                    : "border-gold/30 text-bone-muted hover:border-gold hover:text-bone"
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {(activeCategory || activeSize || activeMin) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs tracking-wide text-bone-muted underline hover:text-bone"
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}
