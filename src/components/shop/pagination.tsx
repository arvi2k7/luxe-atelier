import Link from "next/link";

function pageHref(searchParams: Record<string, string | undefined>, targetPage: number): string {
  const p = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v && k !== "page") p.set(k, v);
  });
  if (targetPage > 1) p.set("page", String(targetPage));
  return `/shop?${p.toString()}`;
}

type Props = {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  searchParams: Record<string, string | undefined>;
};

const linkClass = "border border-gold/30 px-4 py-2 text-xs tracking-[0.1em] text-bone-muted hover:border-gold hover:text-bone transition-colors";
const disabledClass = "border border-gold/10 px-4 py-2 text-xs tracking-[0.1em] text-bone-muted/30";

export function Pagination({ page, totalPages, hasPrev, hasNext, searchParams }: Props) {
  return (
    <div className="mt-12 flex items-center justify-center gap-6">
      {hasPrev ? (
        <Link href={pageHref(searchParams, page - 1)} className={linkClass}>
          ← Previous
        </Link>
      ) : (
        <span className={disabledClass}>
          ← Previous
        </span>
      )}
      <span className="font-body text-sm text-bone-muted">
        Page {page} of {totalPages}
      </span>
      {hasNext ? (
        <Link href={pageHref(searchParams, page + 1)} className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className={disabledClass}>
          Next →
        </span>
      )}
    </div>
  );
}
