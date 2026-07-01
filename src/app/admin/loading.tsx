import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16">
      <Skeleton className="h-3 w-28 bg-panel" />
      <Skeleton className="mt-2 h-8 w-64 bg-panel" />
      <Skeleton className="mt-1 h-4 w-48 bg-panel" />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gold/30 bg-panel p-6">
            <Skeleton className="h-6 w-24 bg-vitrine/50" />
            <Skeleton className="mt-2 h-3 w-40 bg-vitrine/50" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-12 h-10 w-24 bg-panel" />
    </div>
  );
}
