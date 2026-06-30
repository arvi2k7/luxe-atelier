import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { ProductCard } from "@/components/shop/product-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serialize } from "@/lib/utils";

export const metadata = { title: "Best Sellers", description: "Our most popular pieces." };

export default async function BestSellersPage() {
  await connectDB();

  const bestSellers: any[] = serialize(await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
    { $sort: { totalSold: -1 } },
    { $limit: 20 },
    { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
    { $unwind: "$product" },
    { $replaceRoot: { newRoot: { $mergeObjects: ["$product", { totalSold: "$totalSold" }] } } },
  ]));

  const fallback = bestSellers.length === 0
    ? serialize(await Product.find({ featured: true }).limit(20).lean())
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]} />
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone">Best Sellers</h1>
      <p className="mt-2 text-sm text-bone-muted">Our most popular pieces.</p>
      {bestSellers.length === 0 && (
        <p className="mt-6 text-sm text-bone-muted">No sales data yet — showing featured pieces.</p>
      )}
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(bestSellers.length > 0 ? bestSellers : fallback).map((p: any) => (
          <div key={String(p._id)} className="relative">
            {bestSellers.length > 0 && (
              <span className="absolute bottom-1 left-1 z-10 bg-vitrine/80 text-xs text-bone-muted px-2 py-0.5">
                {p.totalSold} {p.totalSold === 1 ? "sold" : "sold"}
              </span>
            )}
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
