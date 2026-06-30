import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Link from "next/link";
import Image from "next/image";
import { RemoveWishlistButton } from "./remove-button";

export default async function WishlistPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = (session.user as any)?.id;
  await connectDB();

  const wishlist: any = await Wishlist.findOne({ userId })
    .populate("items.productId")
    .lean();

  const items = (wishlist?.items ?? []).filter((i: any) => i.productId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <Link href="/profile"
        className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
        ← Back to profile
      </Link>

      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-bone">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <p className="text-sm text-bone-muted">Your wishlist is empty.</p>
          <Link href="/shop"
            className="mt-3 inline-block text-sm text-gold-bright hover:underline">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 divide-y divide-gold/10">
          {items.map(({ productId: p }: any) => (
            <div key={String(p._id)} className="flex items-center gap-4 py-5">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-gold/20 bg-panel">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} width={64} height={64} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-panel to-vitrine" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${p.slug}`} className="font-display text-base text-bone hover:text-gold-bright transition-colors">
                  {p.name}
                </Link>
                <p className="text-xs text-bone-muted">{p.category} · ${p.price.toLocaleString()}</p>
                <p className={`text-xs ${p.stock > 0 ? "text-green-400" : "text-bone-muted"}`}>
                  {p.stock > 0 ? "In stock" : "Out of stock"}
                </p>
              </div>
              <RemoveWishlistButton productId={String(p._id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
