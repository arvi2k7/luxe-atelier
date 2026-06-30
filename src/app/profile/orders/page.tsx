import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProfileOrderCard } from "@/components/profile/order-card";

export const metadata = { title: "My Orders" };

export default async function ProfileOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-bone">My Orders</h1>
        <Link href="/profile" className="text-xs text-bone-muted hover:text-gold-bright transition-colors">Back to Profile</Link>
      </div>

      {orders.length === 0 ? (
        <div className="border border-gold/20 bg-panel p-8 text-center">
          <p className="text-sm text-bone-muted">No orders yet.</p>
          <Link href="/shop" className="mt-4 inline-block border border-gold/30 px-6 py-3 text-xs uppercase tracking-[0.12em] text-gold-bright hover:bg-gold/10 transition-colors">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <ProfileOrderCard key={String(order._id)} order={JSON.parse(JSON.stringify(order))} />
          ))}
        </div>
      )}
    </div>
  );
}
