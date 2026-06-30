import Link from "next/link";
import { ShopWindow } from "@/components/home/shop-window";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import { testimonials } from "@/lib/testimonials";
import { serialize } from "@/lib/utils";

const windows = [
  { id: 1, label: "Outerwear", sub: "Tailored coats, cut close", href: "/shop?category=Outerwear" },
  { id: 2, label: "Evening", sub: "Pieces for low light", href: "/shop?category=Evening" },
  { id: 3, label: "Accessories", sub: "Gold, leather, glass", href: "/shop?category=Accessories" },
  { id: 4, label: "Archive", sub: "Limited, rarely repeated", href: "/shop?category=Archive" },
];

export default async function Home() {
  await connectDB();
  const featured = serialize(await Product.find({ featured: true }).limit(4).lean());

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {windows.map((w, i) => (
          <ShopWindow key={w.id} label={w.label} sub={w.sub} index={i} href={w.href} />
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-bone">
            New Arrivals
          </h2>
          <Link href="/shop"
            className="text-xs tracking-[0.1em] text-bone-muted hover:text-gold-bright transition-colors">
            View all
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {(featured as any[]).map((p) => (
              <ProductCard key={String(p._id)} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-bone-muted">
            No featured products yet —{" "}
            <Link href="/shop" className="text-gold-bright hover:underline">
              browse the full catalogue
            </Link>
            .
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <p className="text-xs uppercase tracking-[0.15em] text-gold">What our customers say</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="border border-gold/20 bg-panel p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s} className="text-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-sm italic text-bone-muted leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-gold">{t.name} — {t.location}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
