import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import type { IProduct } from "@/models/Product";
import { ProductForm, type ProductFormData } from "@/components/admin/product-form";
import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  await connectDB();
  const p = await Product.findById(id).lean() as IProduct & { _id: string } | null;
  if (!p) notFound();

  const initial: ProductFormData = {
    _id: String(p._id),
    name: p.name,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? ("") as number | "",
    category: p.category,
    sizes: p.sizes ?? [],
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold ?? 5,
    featured: p.featured ?? false,
    images: p.images ?? [],
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/products"
        className="text-xs text-bone-muted hover:text-gold-bright transition-colors">
        ← Products
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-bone">Edit Product</h1>
      <div className="mt-8">
        <ProductForm mode="edit" initial={initial} />
      </div>
    </div>
  );
}
