import Link from "next/link";
import Image from "next/image";

type ShopWindowProps = {
  label: string;
  sub: string;
  index: number;
  href: string;
  image?: string;
};

export function ShopWindow({ label, sub, index, href, image }: ShopWindowProps) {
  return (
    <Link href={href} className="group relative block h-[60vh] min-h-[420px] overflow-hidden border-r border-gold/10 last:border-r-0">
      {image ? (
        <Image src={image} alt={label} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-b from-panel via-vitrine to-black transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ opacity: 0.9 - index * 0.05 }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-gold-bright/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <p className="font-display text-3xl font-semibold tracking-tight text-bone">
          {label}
        </p>
        <p className="mt-2 max-w-[20ch] font-body text-sm text-bone-muted">{sub}</p>
      </div>
    </Link>
  );
}
