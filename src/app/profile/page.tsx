import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import SavedAddress from "@/models/SavedAddress";
import LoyaltyAccount from "@/models/LoyaltyAccount";
import Link from "next/link";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { AddressList } from "@/components/profile/address-list";
import { LoyaltyDisplay } from "@/components/profile/loyalty-display";
import { PreferencesForm } from "@/components/profile/preferences-form";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const [user, orders, addresses, loyalty] = await Promise.all([
    User.findById(session.user.id).lean(),
    Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(5).lean(),
    SavedAddress.find({ userId: session.user.id }).sort({ isDefault: -1 }).lean(),
    LoyaltyAccount.findOne({ userId: session.user.id }).lean(),
  ]);

  if (!user) redirect("/login");

  let loyaltyData: { points: number; tier: { name: string; threshold: number; nextTier: { name: string; pointsNeeded: number } | null }; referralCode?: string } | null = null;
  if (loyalty) {
    const { calculateTier } = await import("@/lib/loyalty");
    const points = (loyalty as any).points || 0;
    loyaltyData = {
      points,
      tier: calculateTier(points),
      referralCode: (loyalty as any).referralCode,
    };
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 space-y-12">
      <h1 className="font-display text-3xl text-bone">My Profile</h1>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold">Profile</h2>
        </div>
        <ProfileEditor user={JSON.parse(JSON.stringify(user))} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold">Saved Addresses</h2>
        </div>
        <AddressList addresses={JSON.parse(JSON.stringify(addresses))} />
      </section>

      {loyaltyData && (
        <section>
          <LoyaltyDisplay data={loyaltyData} />
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold">Communication Preferences</h2>
        </div>
        <PreferencesForm user={JSON.parse(JSON.stringify(user))} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold">Recent Orders</h2>
          <Link href="/profile/orders" className="text-xs text-bone-muted hover:text-gold-bright transition-colors">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="border border-gold/20 bg-panel p-6 text-center">
            <p className="text-sm text-bone-muted">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(orders as any[]).map((order) => (
              <div key={String(order._id)} className="border border-gold/20 bg-panel p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-gold">{order.orderNumber}</p>
                  <p className="text-xs text-bone-muted mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-bone-muted">${(order as any).total.toFixed(2)}</span>
                  <span className={`text-xs uppercase tracking-[0.1em] ${(order as any).status === "delivered" ? "text-green-400" : "text-gold-bright"}`}>
                    {(order as any).status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
