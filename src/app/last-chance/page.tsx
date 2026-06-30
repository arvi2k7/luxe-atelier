import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serialize } from "@/lib/utils";

export const metadata = { title: "Last Chance", description: "Low stock. Once gone, gone." };

export default async function LastChancePage() {
  await connectDB();

  const products = serialize(await Product.find({
    stock: { $gt: 0 },
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
  }).sort({ stock: 1 }).lean());

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Last Chance" }]} />
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone">Last Chance</h1>
      <p className="mt-2 text-sm text-bone-muted">Low stock. Once gone, gone.</p>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(products as any[]).map((p) => (
          <div key={String(p._id)} className="relative">
            <span className="absolute top-1 right-1 z-10 bg-wine/80 text-xs text-bone px-2 py-0.5">
              {p.stock} left
            </span>
            <ProductCard product={p} />
          </div>
        ))}
        {products.length === 0 && <p className="col-span-full text-sm text-bone-muted">No low-stock items right now.</p>}
      </div>
    </div>
  );
}
