import { Skeleton } from "@/components/ui/skeleton";

export default function AdminInventoryLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-12">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16 bg-panel" />
        <Skeleton className="h-8 w-36 bg-panel" />
        <Skeleton className="h-3 w-72 bg-panel" />
      </div>

      <div className="mt-10 divide-y divide-gold/10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4 gap-6">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-48 bg-panel" />
              </div>
              <Skeleton className="h-3 w-36 bg-panel" />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Skeleton className="h-8 w-20 bg-panel" />
              <Skeleton className="h-8 w-14 bg-panel" />
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
