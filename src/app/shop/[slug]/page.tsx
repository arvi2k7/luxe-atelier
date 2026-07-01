import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import type { IProduct } from "@/models/Product";
import Review from "@/models/Review";
import { AddToCart } from "@/components/shop/add-to-cart";
import { ImageGallery } from "@/components/shop/image-gallery";
import { ProductCard } from "@/components/shop/product-card";
import { NotifyMeForm } from "@/components/shop/notify-me-form";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { SizeGuideModal } from "@/components/shop/size-guide-modal";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serialize } from "@/lib/utils";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { RecentlyViewedTracker } from "@/components/shop/recently-viewed-tracker";
import { RecentlyViewed } from "@/components/shop/recently-viewed";
import { ReviewForm } from "@/components/shop/review-form";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean() as IProduct & { _id: string } | null;
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ review?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  await connectDB();
  const product = serialize(await Product.findOne({ slug }).lean()) as IProduct & { _id: string };
  if (!product) notFound();

  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const inStock = product.stock > 0;

  const related: Array<IProduct & { _id: string }> = serialize(
    await Product.find({ category: product.category, _id: { $ne: product._id } })
      .sort({ createdAt: -1 }).limit(4).lean()
  );

  let bundleProducts: Array<IProduct & { _id: string }> = [];
  if (product.bundleIds && product.bundleIds.length > 0) {
    bundleProducts = serialize(await Product.find({ _id: { $in: product.bundleIds } }).lean());
  }

  const reviews = await Review.find({ productId: product._id, status: "approved" })
    .sort({ createdAt: -1 }).lean();
  const avgRating = reviews.length
    ? reviews.reduce((s: number, r) => s + (r as { rating: number }).rating, 0) / reviews.length
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 md:px-10">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: product.category, href: `/shop?category=${product.category}` },
        { label: product.name },
      ]} />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <ImageGallery images={product.images ?? []} name={product.name} />

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-bone text-balance">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3 font-body text-lg font-medium">
            <span className="text-bone">${product.price.toLocaleString()}</span>
            {onSale && <span className="text-bone-muted line-through">${product.compareAtPrice!.toLocaleString()}</span>}
          </div>

          {avgRating && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">{Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.round(avgRating) ? "text-gold" : "text-gold/20"}>★</span>
              ))}</div>
              <span className="text-xs text-bone-muted">{avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
            </div>
          )}

          <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-muted">{product.description}</p>

          {product.fitNotes && (
            <div className="mt-4 bg-panel border border-gold/20 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-gold mb-1">Fit</p>
              <p className="text-sm text-bone-muted leading-relaxed">{product.fitNotes}</p>
            </div>
          )}

          {product.modelStats && (
            <p className="mt-4 text-xs text-bone-muted">
              Model is {product.modelStats.height}, wearing {product.modelStats.size}.
              {product.modelStats.note && ` ${product.modelStats.note}`}
            </p>
          )}

          {product.colorVariants != null && product.colorVariants.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.12em] text-gold mb-2">Colour</p>
              <div className="flex gap-3">
                <span className="w-8 h-8 rounded-full ring-2 ring-gold-bright ring-offset-2 ring-offset-vitrine"
                  style={{ backgroundColor: product.colorVariants[0]?.hex ?? "#0E1410" }} title="Current" />
                {product.colorVariants.map((v: { slug: string; hex: string; color: string }) => (
                  <a key={v.slug} href={`/shop/${v.slug}`}>
                    <span className="block w-8 h-8 rounded-full border border-gold/30 hover:border-gold transition-colors"
                      style={{ backgroundColor: v.hex }} title={v.color} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.15em] text-gold">Size</p>
              <SizeGuideModal category={product.category} />
            </div>
          </div>

          <AddToCart
            productId={String(product._id)} slug={product.slug} name={product.name}
            price={product.price} sizes={product.sizes} inStock={inStock}
            stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
          {!inStock && <NotifyMeForm productId={String(product._id)} />}
          <div className="mt-4"><WishlistButton productId={String(product._id)} /></div>

          {product.pressQuotes != null && product.pressQuotes.length > 0 && (
            <div className="mt-8 space-y-3">
              {product.pressQuotes.map((q: { quote: string; url?: string; publication: string }, i: number) => (
                <div key={i} className="bg-panel border border-gold/20 p-4">
                  <p className="text-sm italic text-bone-muted leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-gold">
                    {q.url ? <a href={q.url} target="_blank" rel="noopener" className="hover:text-gold-bright">{q.publication}</a> : q.publication}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {bundleProducts.length > 0 && (
        <ScrollReveal>
          <div className="mt-16 border-t border-gold/20 pt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-bone text-balance">Complete the look</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {bundleProducts.map((p) => <ProductCard key={String(p._id)} product={p} />)}
            </div>
          </div>
        </ScrollReveal>
      )}

      {related.length >= 2 && (
        <ScrollReveal>
          <div className="mt-16 border-t border-gold/20 pt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-bone text-balance">You may also like</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={String(p._id)} product={p} />)}
            </div>
          </div>
        </ScrollReveal>
      )}

      {reviews.length > 0 && (
        <ScrollReveal>
          <div className="mt-16 border-t border-gold/20 pt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-bone text-balance">Reviews</h2>
            <div className="mt-8 space-y-6">
              {reviews.map((r: { _id: string; rating: number; title: string; body: string; createdAt: Date }) => (
                <div key={String(r._id)} className="border-b border-gold/10 pb-6">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < r.rating ? "text-gold text-sm" : "text-gold/20 text-sm"}>★</span>
                    ))}
                  </div>
                  <p className="font-display text-base text-bone">{r.title}</p>
                  <p className="mt-1 text-xs text-bone-muted">{new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                  <p className="mt-2 text-sm text-bone-muted leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {sp.review && <ReviewForm productId={String(product._id)} />}

      <RecentlyViewedTracker product={{
        productId: String(product._id), slug: product.slug, name: product.name,
        price: product.price, image: product.images?.[0], category: product.category,
      }} />
      <RecentlyViewed currentProductId={String(product._id)} />
    </div>
  );
}
