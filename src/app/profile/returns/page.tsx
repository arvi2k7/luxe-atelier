import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ReturnRequest from "@/models/ReturnRequest";
import { ReturnPortal } from "@/components/profile/return-portal";

export const metadata = { title: "Returns" };

export default async function ReturnsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const [orders, returns] = await Promise.all([
    Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean(),
    ReturnRequest.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <h1 className="font-display text-3xl text-bone mb-8">Returns & Exchanges</h1>
      <ReturnPortal
        orders={JSON.parse(JSON.stringify(orders))}
        returns={JSON.parse(JSON.stringify(returns))}
      />
    </div>
  );
}
