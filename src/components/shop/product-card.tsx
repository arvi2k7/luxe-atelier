import Image from "next/image";
import Link from "next/link";
import { QuickAddButton } from "./quick-add-button";

type ProductCardProduct = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  lowStockThreshold: number;
  images?: string[];
  exclusive?: boolean;
  featured?: boolean;
  createdAt?: string;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const lowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const image = product.images?.[0];
  const secondImage = product.images?.[1];

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-panel">
        {image ? (
          <div className="relative w-full h-full">
            <Image src={image} alt={product.name} fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover transition-all duration-500 ${secondImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`} />
            {secondImage && (
              <Image src={secondImage} alt={product.name} fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-panel via-vitrine to-black transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {onSale && <span className="bg-wine px-2 py-0.5 text-xs tracking-wide text-bone">Sale</span>}
          {product.exclusive && <span className="bg-panel border border-gold/60 px-2 py-0.5 text-xs tracking-wide text-gold">Exclusive</span>}
          {product.stock <= 3 && product.stock > 0 && <span className="bg-wine/40 px-2 py-0.5 text-xs text-red-400 border border-wine/40">Limited</span>}
        </div>
        {!onSale && lowStock && (
          <span className="absolute right-3 top-3 text-xs tracking-wide text-gold-bright">Low stock</span>
        )}
        <QuickAddButton product={product as any} />
      </div>
      <div className="mt-3">
        <p className="font-display text-lg text-bone">{product.name}</p>
        <p className="text-xs uppercase tracking-wide text-bone-muted">{product.category}</p>
        <div className="mt-1 flex items-center gap-2 font-body text-sm font-medium">
          <span className="text-bone">${product.price.toLocaleString()}</span>
          {onSale && (
            <span className="text-bone-muted line-through">${product.compareAtPrice!.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
