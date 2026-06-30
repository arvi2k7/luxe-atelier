import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";

export const metadata = { title: "Inventory Alerts — Admin" };

export default async function InventoryAlertsPage() {
  await connectDB();

  const lowStock = await Product.find({
    $expr: { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$lowStockThreshold"] }] },
  }).sort({ stock: 1 }).lean();

  const outOfStock = await Product.find({ stock: 0 }).sort({ name: 1 }).lean();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-bone">Inventory Alerts</h1>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold">Low Stock ({lowStock.length})</h2>
        </div>
        {lowStock.length === 0 ? (
          <p className="text-sm text-bone-muted">No low-stock items.</p>
        ) : (
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={String(p._id)} className="border border-gold/20 bg-panel p-4 flex items-center justify-between">
                <div>
                  <Link href={`/admin/products/${p._id}/edit`} className="text-sm text-bone hover:text-gold-bright transition-colors">{p.name}</Link>
                  <p className="text-xs text-bone-muted">{p.sku || "—"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-mono ${p.stock <= (p.lowStockThreshold || 5) / 2 ? "text-red-400" : "text-gold-bright"}`}>
                    {p.stock} / {p.lowStockThreshold || 5}
                  </span>
                  <Link href={`/admin/products/${p._id}/edit`} className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold">Out of Stock ({outOfStock.length})</h2>
        </div>
        {outOfStock.length === 0 ? (
          <p className="text-sm text-bone-muted">No out-of-stock items.</p>
        ) : (
          <div className="space-y-2">
            {outOfStock.map((p) => (
              <div key={String(p._id)} className="border border-red-400/20 bg-panel p-4 flex items-center justify-between">
                <div>
                  <Link href={`/admin/products/${p._id}/edit`} className="text-sm text-bone hover:text-gold-bright transition-colors">{p.name}</Link>
                  <p className="text-xs text-bone-muted">{p.sku || "—"}</p>
                </div>
                <Link href={`/admin/products/${p._id}/edit`} className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/admin/inventory" className="inline-block text-xs text-bone-muted hover:text-gold-bright transition-colors">← Back to Inventory</Link>
    </div>
  );
}
