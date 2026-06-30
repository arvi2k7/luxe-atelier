import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">404</p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-bone">
        Not found.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-bone-muted">
        The page you are looking for has moved, been removed, or never existed.
        If you followed a link from an old catalogue, the piece may simply be gone.
      </p>
      <div className="mt-10 flex items-center gap-6">
        <Link href="/shop"
          className="border border-gold bg-gold/10 px-6 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 transition-colors">
          Browse the shop
        </Link>
        <Link href="/"
          className="text-sm text-bone-muted hover:text-bone transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}
