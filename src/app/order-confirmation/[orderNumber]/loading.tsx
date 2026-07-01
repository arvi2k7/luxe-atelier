import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmationLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 text-center md:px-10">
      <Skeleton className="mx-auto h-3 w-32 bg-panel" />
      <Skeleton className="mx-auto mt-4 h-10 w-3/4 bg-panel" />
      <Skeleton className="mx-auto mt-4 h-4 w-1/2 bg-panel" />

      <div className="mt-10 space-y-4 border border-gold/20 bg-panel p-6 text-left">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-48 bg-vitrine/50" />
            <Skeleton className="h-4 w-16 bg-vitrine/50" />
          </div>
        ))}
        <div className="border-t border-gold/20 pt-4 flex justify-between">
          <Skeleton className="h-4 w-12 bg-vitrine/50" />
          <Skeleton className="h-4 w-20 bg-vitrine/50" />
        </div>
      </div>

      <Skeleton className="mx-auto mt-8 h-3 w-72 bg-panel" />
    </div>
  );
}
