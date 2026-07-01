import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-panel" />
          <Skeleton className="h-8 w-28 bg-panel" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 bg-panel" />
        ))}
      </div>

      <div className="mt-8 divide-y divide-gold/10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4 gap-4">
            <div className="space-y-2 min-w-0">
              <Skeleton className="h-4 w-36 bg-panel" />
              <Skeleton className="h-3 w-64 bg-panel" />
              <Skeleton className="h-3 w-28 bg-panel" />
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Skeleton className="h-3 w-16 bg-panel" />
              <Skeleton className="h-3 w-8 bg-panel" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gold/10 pt-6">
        <Skeleton className="h-3 w-32 bg-panel" />
      </div>
    </div>
  );
}
