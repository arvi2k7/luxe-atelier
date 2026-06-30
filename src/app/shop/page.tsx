import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import { Filters } from "@/components/shop/filters";
import { Pagination } from "@/components/shop/pagination";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serialize } from "@/lib/utils";

const PAGE_SIZE = 12;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const category = params.category;
  return {
    title: category ?? "Shop",
    description: category
      ? `Browse our ${category} collection — considered pieces in small runs.`
      : "Browse the full Luxe Atelier catalogue. Considered pieces, made in small runs.",
  };
}

type SearchParams = {
  category?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (params.category) filter.category = params.category;
  if (params.size) filter.sizes = params.size;
  if (params.minPrice || params.maxPrice) {
    const price: Record<string, number> = {};
    if (params.minPrice) price.$gte = Number(params.minPrice);
    if (params.maxPrice) price.$lte = Number(params.maxPrice);
    filter.price = price;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };
  const sort = sortMap[params.sort ?? ""] ?? { createdAt: -1 };

  const page = Math.max(1, Number(params.page ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(PAGE_SIZE).lean(),
    Product.countDocuments(filter),
  ]);

  const serializedProducts = serialize(products);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone">
        Shop
      </h1>
      <p className="mt-2 text-sm text-bone-muted">
        {total} {total === 1 ? "piece" : "pieces"}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[200px_1fr]">
        <Filters />
        <div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {serializedProducts.map((p) => (
              <ProductCard key={String(p._id)} product={p} />
            ))}
            {products.length === 0 && (
              <p className="col-span-full text-sm text-bone-muted">
                No pieces match those filters.
              </p>
            )}
          </div>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} hasPrev={hasPrev} hasNext={hasNext} searchParams={params} />
          )}
        </div>
      </div>
    </div>
  );
}
