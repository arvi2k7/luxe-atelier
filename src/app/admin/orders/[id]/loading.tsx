import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrderDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-12">
      <Skeleton className="h-3 w-16 bg-panel" />

      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12 bg-panel" />
          <Skeleton className="h-8 w-48 bg-panel" />
          <Skeleton className="h-3 w-36 bg-panel" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-3 w-20 bg-panel" />
          <Skeleton className="h-7 w-28 bg-panel" />
        </div>
      </div>

      <div className="mt-8 border border-gold/20 bg-panel p-6 space-y-3">
        <Skeleton className="h-3 w-16 bg-vitrine/50" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-48 bg-vitrine/50" />
            <Skeleton className="h-4 w-16 bg-vitrine/50" />
          </div>
        ))}
        <div className="border-t border-gold/20 pt-3 flex justify-between">
          <Skeleton className="h-4 w-12 bg-vitrine/50" />
          <Skeleton className="h-4 w-20 bg-vitrine/50" />
        </div>
      </div>

      <div className="mt-6 border border-gold/20 bg-panel p-6">
        <Skeleton className="h-3 w-16 bg-vitrine/50" />
        <div className="mt-4 space-y-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-56 bg-vitrine/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
