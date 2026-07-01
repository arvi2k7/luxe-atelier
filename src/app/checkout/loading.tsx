import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 md:px-10">
      <Skeleton className="h-10 w-48 bg-panel" />

      <div className="mt-10 space-y-10">
        <section>
          <Skeleton className="h-4 w-20 bg-panel" />
          <div className="mt-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-11 w-full bg-panel" />
            ))}
          </div>
        </section>

        <section>
          <Skeleton className="h-4 w-28 bg-panel" />
          <div className="mt-4 space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-11 w-full bg-panel" />
            ))}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full bg-panel" />
              <Skeleton className="h-11 w-full bg-panel" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full bg-panel" />
              <Skeleton className="h-11 w-full bg-panel" />
            </div>
          </div>
        </section>

        <section>
          <Skeleton className="h-4 w-24 bg-panel" />
          <Skeleton className="mt-4 h-64 w-full bg-panel" />
        </section>
      </div>

      <Skeleton className="mt-10 h-14 w-full bg-panel" />
    </div>
  );
}
