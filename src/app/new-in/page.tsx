import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serialize } from "@/lib/utils";

export const metadata = { title: "New In", description: "Added in the last 30 days." };

export default async function NewInPage() {
  await connectDB();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const products = serialize(await Product.find({ createdAt: { $gte: cutoff } })
    .sort({ createdAt: -1 }).limit(40).lean());

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New In" }]} />
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone">New In</h1>
      <p className="mt-2 text-sm text-bone-muted">Added in the last 30 days.</p>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(products as any[]).map((p) => <ProductCard key={String(p._id)} product={p} />)}
        {products.length === 0 && <p className="col-span-full text-sm text-bone-muted">Nothing new yet — check back soon.</p>}
      </div>
    </div>
  );
}
