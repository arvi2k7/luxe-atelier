export default function NewInLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <div className="h-8 w-28 bg-bone-muted/10 animate-pulse rounded" />
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] bg-bone-muted/10 animate-pulse" />
            <div className="h-4 w-3/4 bg-bone-muted/10 animate-pulse rounded" />
            <div className="h-3 w-1/3 bg-bone-muted/10 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
