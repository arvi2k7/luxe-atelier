import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

const shopLinks = [
  { href: "/shop", label: "All Pieces" },
  { href: "/collections", label: "Collections" },
  { href: "/shop?featured=true", label: "New Arrivals" },
];

const discoverLinks = [
  { href: "/new-in", label: "New In" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/last-chance", label: "Last Chance" },
  { href: "/back-in-stock", label: "Back in Stock" },
];

const careLinks = [
  { href: "/shipping", label: "Shipping & Returns" },
  { href: "/order-lookup", label: "Order Lookup" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-panel">
      <div className="border-b border-gold/20">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl text-bone">Stay in the archive.</p>
            <p className="mt-1 text-xs text-bone-muted">New arrivals and occasional notes. Never more than twice a month.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-1">
          <p className="font-display text-2xl font-semibold tracking-[0.15em] text-bone">LUXE ATELIER</p>
          <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-bone-muted">
            A quiet shopfront for considered pieces. Crafted in small runs, seen best after dark.
          </p>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">Shop</p>
          <ul className="mt-4 space-y-3">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-body text-sm text-bone-muted transition-colors hover:text-gold-bright">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">Discover</p>
          <ul className="mt-4 space-y-3">
            {discoverLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-body text-sm text-bone-muted transition-colors hover:text-gold-bright">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.15em] text-gold">Customer Care</p>
          <ul className="mt-4 space-y-3">
            {careLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-body text-sm text-bone-muted transition-colors hover:text-gold-bright">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-bone-muted md:flex-row md:px-10">
          <p>&copy; {new Date().getFullYear()} Luxe Atelier. All rights reserved.</p>
          <p className="tracking-[0.1em]">Made in small runs.</p>
        </div>
      </div>
    </footer>
  );
}
