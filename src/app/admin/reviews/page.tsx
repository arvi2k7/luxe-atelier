import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { AdminReviewsTable } from "@/components/admin/reviews-table";

export const metadata = { title: "Reviews — Admin" };

export default async function AdminReviewsPage() {
  await connectDB();
  const reviews = await Review.find({}).sort({ createdAt: -1 }).populate("userId", "name email").populate("productId", "name").lean();

  return (
    <div>
      <h1 className="font-display text-2xl text-bone mb-8">Reviews</h1>
      <AdminReviewsTable reviews={JSON.parse(JSON.stringify(reviews))} />
    </div>
  );
}
