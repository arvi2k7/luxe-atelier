import connectDB from "@/lib/mongodb";
import AbandonedCart from "@/models/AbandonedCart";
import { AdminAbandonedCartsTable } from "@/components/admin/abandoned-carts-table";

export const metadata = { title: "Abandoned Carts — Admin" };

export default async function AdminAbandonedCartsPage() {
  await connectDB();
  const carts = await AbandonedCart.find({}).sort({ lastActive: -1 }).limit(50).lean();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-bone">Abandoned Carts</h1>
      </div>
      <AdminAbandonedCartsTable carts={JSON.parse(JSON.stringify(carts))} />
    </div>
  );
}
