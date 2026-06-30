import connectDB from "@/lib/mongodb";
import ReturnRequest from "@/models/ReturnRequest";
import { AdminReturnsTable } from "@/components/admin/returns-table";

export const metadata = { title: "Returns — Admin" };

export default async function AdminReturnsPage() {
  await connectDB();
  const returns = await ReturnRequest.find({}).sort({ createdAt: -1 }).populate("userId", "name email").lean();

  return (
    <div>
      <h1 className="font-display text-2xl text-bone mb-8">Returns</h1>
      <AdminReturnsTable returns={JSON.parse(JSON.stringify(returns))} />
    </div>
  );
}
