import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <Skeleton className="aspect-[3/4] w-full bg-gradient-to-br from-panel via-vitrine to-black" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-20 bg-panel" />
          <Skeleton className="h-10 w-3/4 bg-panel" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 bg-panel" />
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full bg-panel" />
            <Skeleton className="h-4 w-5/6 bg-panel" />
            <Skeleton className="h-4 w-2/3 bg-panel" />
          </div>
          <div className="pt-4">
            <Skeleton className="h-3 w-12 bg-panel" />
            <div className="mt-3 flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-14 bg-panel" />
              ))}
            </div>
          </div>
          <Skeleton className="mt-6 h-14 w-full bg-panel" />
        </div>
      </div>
    </div>
  );
}
