import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { IProduct } from "@/models/Product";
import { serialize } from "@/lib/utils";

export const metadata = { title: "Back in Stock", description: "Recently restocked pieces." };

export default async function BackInStockPage() {
  await connectDB();

  const products: Array<IProduct & { _id: string }> = serialize(await Product.find({ backInStock: true, stock: { $gt: 0 } })
    .sort({ updatedAt: -1 }).lean());

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Back in Stock" }]} />
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone">Back in Stock</h1>
      <p className="mt-2 text-sm text-bone-muted">Recently restocked pieces.</p>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => <ProductCard key={String(p._id)} product={p} />)}
        {products.length === 0 && <p className="col-span-full text-sm text-bone-muted">No recently restocked items right now.</p>}
      </div>
    </div>
  );
}
