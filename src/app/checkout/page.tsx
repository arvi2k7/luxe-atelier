import { auth } from "@/auth";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function CheckoutPage() {
  const session = await auth();
  return (
    <CheckoutForm
      userName={session?.user?.name}
      userEmail={session?.user?.email}
    />
  );
}
