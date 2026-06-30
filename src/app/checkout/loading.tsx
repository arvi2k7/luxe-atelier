import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
      <Skeleton className="h-10 w-36 bg-panel" />
      <Skeleton className="mt-6 h-12 w-full bg-panel" />
      <div className="mt-8 space-y-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full bg-panel" />
        ))}
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full bg-panel" />
          <Skeleton className="h-10 w-full bg-panel" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full bg-panel" />
          <Skeleton className="h-10 w-full bg-panel" />
        </div>
      </div>
      <Skeleton className="mt-4 h-14 w-full bg-panel" />
    </div>
  );
}
