import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import Link from "next/link";
import type { IProduct } from "@/models/Product";
import { serialize } from "@/lib/utils";

type SearchParams = { q?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search` : "Search",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let products: Array<IProduct & { _id: string }> = [];

  if (query) {
    await connectDB();
    products = serialize(await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean());
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Search</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
        {query ? `Results for "${query}"` : "Search the catalogue"}
      </h1>

      {query && (
        <p className="mt-1 text-sm text-bone-muted">
          {products.length} {products.length === 1 ? "piece" : "pieces"} found
        </p>
      )}

      {!query && (
        <p className="mt-4 text-sm text-bone-muted">
          Use the search bar above to find a piece by name, category, or description.
        </p>
      )}

      {query && products.length === 0 && (
        <div className="mt-10">
          <p className="text-sm text-bone-muted">
            Nothing matched that search.
          </p>
          <Link href="/shop"
            className="mt-3 inline-block text-sm text-gold-bright hover:underline">
            Browse everything →
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={String(p._id)} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
