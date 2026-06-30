import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serialize } from "@/lib/utils";

export const metadata = {
  title: "Collections",
  description: "Four lines. Outerwear, evening, accessories, and archive. Each one considered.",
};

const CATEGORIES = ["Outerwear", "Evening", "Accessories", "Archive"] as const;

const CATEGORY_COPY: Record<string, { sub: string }> = {
  Outerwear:   { sub: "Coats and layers built for the cold and the long walk home." },
  Evening:     { sub: "Pieces that come alive in low light." },
  Accessories: { sub: "The details that finish it — gold, leather, glass." },
  Archive:     { sub: "Small runs, rarely repeated. Once they are gone, they are gone." },
};

export default async function CollectionsPage() {
  await connectDB();

  const allProducts = serialize(await Product.find({}).lean());

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = (allProducts as any[]).filter((p) => p.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone">
        Collections
      </h1>
      <p className="mt-2 text-sm text-bone-muted">
        Four lines. Each one considered.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/new-in" className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors">New In</Link>
        <Link href="/best-sellers" className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors">Best Sellers</Link>
        <Link href="/last-chance" className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors">Last Chance</Link>
        <Link href="/back-in-stock" className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors">Back in Stock</Link>
      </div>

      <div className="mt-16 space-y-20">
        {CATEGORIES.map((cat) => {
          const products = grouped[cat] ?? [];
          if (products.length === 0) return null;
          return (
            <section key={cat}>
              <div className="flex items-end justify-between border-b border-gold/20 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-bone">{cat}</h2>
                  <p className="mt-1 text-xs text-bone-muted max-w-md">
                    {CATEGORY_COPY[cat].sub}
                  </p>
                </div>
                <Link
                  href={`/shop?category=${cat}`}
                  className="text-xs tracking-[0.1em] text-bone-muted hover:text-gold-bright transition-colors flex-shrink-0 ml-6"
                >
                  All {cat} →
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {products.slice(0, 4).map((p: any) => (
                  <ProductCard key={String(p._id)} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
