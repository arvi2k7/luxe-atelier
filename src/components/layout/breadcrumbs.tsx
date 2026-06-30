import Link from "next/link";

type Item = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-xs text-bone-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-gold-bright transition-colors">{item.label}</Link>
            ) : (
              <span className="text-bone">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
