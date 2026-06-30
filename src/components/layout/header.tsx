import Link from "next/link";
import { CartDrawer } from "@/components/conversion/cart-drawer";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileNav } from "@/components/layout/mobile-nav";
import { auth } from "@/auth";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/order-lookup", label: "Order Lookup" },
];

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0];

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-vitrine/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 md:px-10">
        <Link href="/"
          className="font-display text-2xl font-semibold tracking-[0.15em] text-bone flex-shrink-0">
          LUXE ATELIER
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="font-body text-sm tracking-[0.05em] text-bone-muted transition-colors hover:text-gold-bright">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 flex-shrink-0">
          <HeaderSearch />
          <div className="hidden md:block">
            {user ? (
              <Link href="/profile"
                className="font-body text-sm tracking-[0.05em] text-bone-muted transition-colors hover:text-gold-bright">
                {firstName}
              </Link>
            ) : (
              <Link href="/login"
                className="font-body text-sm tracking-[0.05em] text-bone-muted transition-colors hover:text-gold-bright">
                Sign in
              </Link>
            )}
          </div>
          <MobileNav userName={firstName} />
        </div>
      </div>
    </header>
    <CartDrawer />
  );
}
