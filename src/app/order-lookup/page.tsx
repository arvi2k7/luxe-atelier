import { OrderLookupForm } from "./lookup-form";

export const metadata = {
  title: "Order Lookup",
  description: "Look up your order by order number and email.",
};

export default function OrderLookupPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-16 md:px-10">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Customer Service</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-bone">
        Order Lookup
      </h1>
      <p className="mt-3 text-sm text-bone-muted">
        Enter your order number and email address to see your order details.
      </p>
      <div className="mt-8">
        <OrderLookupForm />
      </div>
    </div>
  );
}
