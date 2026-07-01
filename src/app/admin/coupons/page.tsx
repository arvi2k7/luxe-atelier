import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export default async function AdminCouponsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="mx-auto max-w-4xl px-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-bone">Coupons</h1>
        </div>
        <Link href="/admin/coupons/new"
          className="border border-gold bg-gold/10 px-4 py-2 text-xs tracking-[0.1em] text-gold-bright hover:bg-gold/20 transition-colors">
          + New Coupon
        </Link>
      </div>

      <div className="mt-10 divide-y divide-gold/10">
        {coupons.map((c) => {
          const expired = c.expiresAt && new Date() > new Date(c.expiresAt);
          return (
            <div key={String(c._id)} className="flex items-center justify-between py-4 gap-4">
              <div className="min-w-0">
                <p className="font-display text-base text-bone">{c.code}</p>
                <p className="text-xs text-bone-muted">
                  {c.discountPercent}% off · {c.usedCount}/{c.maxUses || "∞"} uses
                  {c.expiresAt && ` · expires ${new Date(c.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs ${expired ? "text-red-400" : c.active ? "text-green-400" : "text-bone-muted"}`}>
                  {expired ? "Expired" : c.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          );
        })}
        {coupons.length === 0 && (
          <p className="py-8 text-sm text-bone-muted">No coupons yet.</p>
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
