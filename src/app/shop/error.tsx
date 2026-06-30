"use client";

import Link from "next/link";

export default function ShopErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Error</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone">
        Couldn&apos;t load the shop.
      </h1>
      <p className="mt-4 text-sm text-bone-muted">
        There was a problem fetching products.
      </p>
      <div className="mt-10 flex items-center gap-6">
        <button onClick={reset}
          className="border border-gold bg-gold/10 px-6 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 transition-colors">
          Try again
        </button>
        <Link href="/"
          className="text-sm text-bone-muted hover:text-bone transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}
