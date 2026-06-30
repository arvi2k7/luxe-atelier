import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrdersByStatusChart } from "@/components/admin/orders-by-status-chart";

export const metadata = { title: "Reports — Admin" };

export default async function AdminReportsPage() {
  await connectDB();

  const [revenueResult, , monthlyRevenue] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 }, avg: { $avg: "$total" } } },
    ]),
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
  ]);

  const stats = revenueResult[0] || { total: 0, count: 0, avg: 0 };

  return (
    <div>
      <h1 className="font-display text-2xl text-bone mb-8">Reports</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-gold/20 bg-panel p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-bone-muted">Total Revenue</p>
          <p className="mt-2 font-display text-2xl text-gold-bright">${stats.total.toLocaleString()}</p>
        </div>
        <div className="border border-gold/20 bg-panel p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-bone-muted">Total Orders</p>
          <p className="mt-2 font-display text-2xl text-bone">{stats.count.toLocaleString()}</p>
        </div>
        <div className="border border-gold/20 bg-panel p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-bone-muted">Avg Order Value</p>
          <p className="mt-2 font-display text-2xl text-bone">${stats.avg.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <RevenueChart />
        <OrdersByStatusChart />
      </div>

      <div className="border border-gold/20 bg-panel p-6">
        <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold mb-4">Monthly Revenue</h2>
        <div className="space-y-3">
          {monthlyRevenue.map((m: { _id: string; total: number; count: number }) => (
            <div key={m._id} className="flex items-center justify-between text-sm">
              <span className="text-bone-muted">{m._id}</span>
              <div className="flex items-center gap-6">
                <span className="text-bone-muted">{m.count} orders</span>
                <span className="font-mono text-gold-bright w-24 text-right">${m.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
