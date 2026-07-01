export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-16 md:px-10 space-y-12">
      <div className="h-8 w-32 bg-bone-muted/10 animate-pulse rounded" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-4 w-28 bg-bone-muted/10 animate-pulse rounded" />
          <div className="h-40 bg-bone-muted/10 animate-pulse rounded border border-gold/20" />
        </div>
      ))}
    </div>
  );
}
