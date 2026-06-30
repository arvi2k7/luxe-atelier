"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    label: "Store", links: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/products", label: "Products" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/inventory", label: "Inventory" },
      { href: "/admin/inventory-alerts", label: "Inventory Alerts" },
      { href: "/admin/customers", label: "Customers" },
    ],
  },
  {
    label: "Commerce", links: [
      { href: "/admin/coupons", label: "Coupons" },
      { href: "/admin/gift-cards", label: "Gift Cards" },
      { href: "/admin/abandoned-carts", label: "Abandoned Carts" },
    ],
  },
  {
    label: "Content", links: [
      { href: "/admin/reviews", label: "Reviews" },
      { href: "/admin/returns", label: "Returns" },
    ],
  },
  {
    label: "Reports", links: [
      { href: "/admin/reports", label: "Reports" },
      { href: "/admin/audit-log", label: "Audit Log" },
    ],
  },
  {
    label: "Settings", links: [
      { href: "/admin/staff", label: "Staff" },
      { href: "/admin/security", label: "Security" },
    ],
  },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-panel border-r border-gold/20 h-screen sticky top-0 flex-col">
      <div className="px-6 py-8 border-b border-gold/20">
        <p className="font-display text-lg tracking-[0.15em] text-bone">LUXE ATELIER</p>
        <p className="text-xs text-bone-muted mt-1">Admin</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-6 text-xs uppercase tracking-[0.12em] text-bone-muted/60 mb-1">{section.label}</p>
            {section.links.map((link) => {
              const active = pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-3 px-6 py-2 text-sm transition-colors ${
                    active
                      ? "text-gold-bright bg-vitrine/50 border-l-2 border-gold-bright"
                      : "text-bone-muted hover:text-bone hover:bg-vitrine/50"
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gold/20">
        <p className="text-xs text-bone-muted truncate">{userName}</p>
        <form action="/admin/login" method="post" className="mt-1">
          <button type="submit" className="text-xs text-bone-muted/60 hover:text-bone transition-colors">Sign out</button>
        </form>
      </div>
    </aside>
  );
}
