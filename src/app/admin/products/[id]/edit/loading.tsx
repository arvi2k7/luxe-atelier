import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-12">
      <Skeleton className="h-3 w-20 bg-panel" />
      <Skeleton className="mt-4 h-3 w-16 bg-panel" />
      <Skeleton className="mt-1 h-8 w-40 bg-panel" />
      <div className="mt-8 space-y-6">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full bg-panel" />
        ))}
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full bg-panel" />
          <Skeleton className="h-10 w-full bg-panel" />
        </div>
        <Skeleton className="h-5 w-40 bg-panel" />
        <Skeleton className="h-6 w-full bg-panel" />
        <Skeleton className="h-12 w-40 bg-panel" />
      </div>
    </div>
  );
}
