import { GiftCardPurchaseForm } from "@/components/conversion/gift-card-purchase-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = {
  title: "Gift Cards",
  description: "Give the gift of considered pieces. Digital gift cards for Luxe Atelier.",
};

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gift Cards" }]} />
      <h1 className="font-display text-4xl font-semibold tracking-tight text-bone mt-4">Gift Cards</h1>
      <p className="mt-2 text-sm text-bone-muted">
        For those who appreciate considered pieces. Delivered digitally.
      </p>

      <div className="mt-10 border border-gold/20 bg-panel p-8">
        <GiftCardPurchaseForm />
      </div>
    </div>
  );
}
