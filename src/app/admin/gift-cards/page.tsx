import connectDB from "@/lib/mongodb";
import GiftCard from "@/models/GiftCard";
import { AdminGiftCardsTable } from "@/components/admin/gift-cards-table";

export const metadata = { title: "Gift Cards — Admin" };

export default async function AdminGiftCardsPage() {
  await connectDB();
  const cards = await GiftCard.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-bone">Gift Cards</h1>
      </div>
      <AdminGiftCardsTable cards={JSON.parse(JSON.stringify(cards))} />
    </div>
  );
}
