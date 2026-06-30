import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import { StockEditor } from "@/components/admin/stock-editor";

export default async function AdminInventoryPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  await connectDB();
  const products = await Product.find({}).sort({ stock: 1 }).lean();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-bone">Inventory</h1>
        <p className="mt-1 text-xs text-bone-muted">
          Products sorted by stock level — low-stock items appear first.
        </p>
      </div>

      <div className="mt-10 divide-y divide-gold/10">
        {(products as any[]).map((p) => {
          const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
          const isOut = p.stock === 0;
          return (
            <div key={String(p._id)}
              className="flex items-center justify-between py-4 gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-base text-bone truncate">{p.name}</p>
                  {isOut && (
                    <span className="text-xs text-red-400">Out of stock</span>
                  )}
                  {isLow && !isOut && (
                    <span className="text-xs text-gold-bright">Low stock</span>
                  )}
                </div>
                <p className="text-xs text-bone-muted">{p.category} · threshold {p.lowStockThreshold}</p>
              </div>
              <StockEditor productId={String(p._id)} currentStock={p.stock} />
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-gold/10 pt-6">
        <Link href="/admin" className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
          ← Back to admin home
        </Link>
      </div>
    </div>
  );
}
