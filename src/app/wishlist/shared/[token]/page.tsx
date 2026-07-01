import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { ProductCard } from "@/components/shop/product-card";
import { notFound } from "next/navigation";
import type { IProduct } from "@/models/Product";
import { serialize } from "@/lib/utils";

export const metadata = { title: "Shared Wishlist" };

export default async function SharedWishlistPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  await connectDB();
  const wishlist = await Wishlist.findOne({ shareToken: token }).lean();

  if (!wishlist || !wishlist.isPublic) {
    notFound();
  }

  const productIds = wishlist.items || [];
  const products: Array<IProduct & { _id: string }> = serialize(await Product.find({ _id: { $in: productIds } }).lean());

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
      <h1 className="font-display text-3xl text-bone">Shared Wishlist</h1>
      <p className="mt-2 text-sm text-bone-muted">Curated pieces shared with you.</p>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-bone-muted">This wishlist is empty.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={String(p._id)} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
