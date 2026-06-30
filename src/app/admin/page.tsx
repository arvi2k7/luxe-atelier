import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrdersByStatusChart } from "@/components/admin/orders-by-status-chart";

export default async function AdminHomePage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  await connectDB();

  const [
    totalOrders,
    pendingOrders,
    revenueResult,
    lowStockCount,
    totalProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Product.countDocuments({
      $expr: { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$lowStockThreshold"] }] },
    }),
    Product.countDocuments(),
  ]);

  const revenue = revenueResult[0]?.total ?? 0;

  const stats = [
    { label: "Total orders", value: totalOrders.toLocaleString() },
    { label: "Pending", value: pendingOrders.toLocaleString(), alert: pendingOrders > 0 },
    { label: "Revenue", value: `$${revenue.toLocaleString()}` },
    { label: "Low stock", value: lowStockCount.toLocaleString(), alert: lowStockCount > 0 },
    { label: "Products", value: totalProducts.toLocaleString() },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Atelier Admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
        Welcome, {session.user?.name}
      </h1>
      <p className="mt-1 text-sm text-bone-muted">{session.user?.email}</p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label}
            className={`border bg-panel p-5 ${s.alert ? "border-gold/60" : "border-gold/20"}`}>
            <p className="text-xs uppercase tracking-[0.12em] text-bone-muted">{s.label}</p>
            <p className={`mt-2 font-display text-3xl font-semibold ${s.alert ? "text-gold-bright" : "text-bone"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <Link href="/admin/products"
          className="border border-gold/30 bg-panel p-6 hover:border-gold transition-colors">
          <p className="font-display text-xl text-bone">Products</p>
          <p className="mt-1 text-xs text-bone-muted">Create, edit, delete, upload images</p>
        </Link>
        <Link href="/admin/orders"
          className="border border-gold/30 bg-panel p-6 hover:border-gold transition-colors">
          <p className="font-display text-xl text-bone">Orders</p>
          <p className="mt-1 text-xs text-bone-muted">View and update order status</p>
        </Link>
        <Link href="/admin/inventory"
          className="border border-gold/30 bg-panel p-6 hover:border-gold transition-colors">
          <p className="font-display text-xl text-bone">Inventory</p>
          <p className="mt-1 text-xs text-bone-muted">Stock levels and low-stock alerts</p>
        </Link>
        <Link href="/admin/customers"
          className="border border-gold/30 bg-panel p-6 hover:border-gold transition-colors">
          <p className="font-display text-xl text-bone">Customers</p>
          <p className="mt-1 text-xs text-bone-muted">Registered accounts and order history</p>
        </Link>
        <Link href="/admin/coupons"
          className="border border-gold/30 bg-panel p-6 hover:border-gold transition-colors">
          <p className="font-display text-xl text-bone">Coupons</p>
          <p className="mt-1 text-xs text-bone-muted">Promo codes and discounts</p>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <OrdersByStatusChart />
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/admin/login" });
        }}
        className="mt-12"
      >
        <button type="submit"
          className="border border-gold/30 px-4 py-2 text-xs tracking-wide text-bone-muted hover:border-gold hover:text-bone transition-colors">
          Sign out
        </button>
      </form>
    </div>
  );
}
