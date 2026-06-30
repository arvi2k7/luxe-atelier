import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";

export default async function NewProductPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/products"
        className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
        ← Products
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-bone">New Product</h1>
      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
