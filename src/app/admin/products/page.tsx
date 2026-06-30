import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import type { IProduct } from "@/models/Product";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-bone">Products</h1>
        </div>
        <Link href="/admin/products/new"
          className="border border-gold bg-gold/10 px-4 py-2 text-xs tracking-[0.1em] text-gold-bright hover:bg-gold/20 transition-colors">
          + New Product
        </Link>
      </div>

      <div className="mt-10 divide-y divide-gold/10">
        {products.map((p: IProduct & { _id: string }) => (
          <div key={String(p._id)} className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.name} width={56} height={56}
                  className="h-14 w-14 flex-shrink-0 object-cover border border-gold/20" />
              ) : (
                <div className="h-14 w-14 flex-shrink-0 bg-gradient-to-br from-panel to-vitrine border border-gold/10" />
              )}
              <div className="min-w-0">
                <p className="font-display text-base text-bone truncate">{p.name}</p>
                <p className="text-xs text-bone-muted">{p.category} · ${p.price.toLocaleString()} · stock {p.stock}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href={`/admin/products/${p._id}/edit`}
                className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
                Edit
              </Link>
              <DeleteProductButton id={String(p._id)} name={p.name} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="py-8 text-sm text-bone-muted">No products yet.</p>
        )}
      </div>

      <div className="mt-8 border-t border-gold/10 pt-6">
        <Link href="/admin" className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
          ← Back to admin home
        </Link>
      </div>
    </div>
  );
}
