"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
];

type Props = {
  userName?: string | null;
};

export function MobileNav({ userName }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        className="flex flex-col justify-center gap-[5px] p-1"
      >
        <span className={`block h-px w-5 bg-bone-muted transition-all duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
        <span className={`block h-px w-5 bg-bone-muted transition-all duration-300 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-px w-5 bg-bone-muted transition-all duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <div className="fixed inset-0 top-[65px] z-40 bg-vitrine flex flex-col px-6 pt-10 pb-16">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="border-b border-gold/10 py-4 font-display text-2xl font-semibold text-bone hover:text-gold-bright transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-10 border-t border-gold/10">
            {userName ? (
              <Link href="/profile"
                className="text-sm text-bone-muted hover:text-gold-bright transition-colors">
                Account ({userName})
              </Link>
            ) : (
              <div className="flex gap-6">
                <Link href="/login"
                  className="text-sm text-bone-muted hover:text-gold-bright transition-colors">
                  Sign in
                </Link>
                <Link href="/register"
                  className="text-sm text-bone-muted hover:text-gold-bright transition-colors">
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
