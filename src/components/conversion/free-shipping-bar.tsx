import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

interface FreeShippingBarProps {
  subtotal: number;
  className?: string;
}

export function FreeShippingBar({ subtotal, className = "" }: FreeShippingBarProps) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const free = remaining === 0;

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs text-bone-muted mb-2">
        {free ? (
          <span className="text-gold-bright">You&apos;ve earned free shipping!</span>
        ) : (
          <span>
            Add <span className="text-gold-bright font-mono">${remaining.toFixed(2)}</span> more for free shipping
          </span>
        )}
        <span className="font-mono">${subtotal.toFixed(2)} / ${FREE_SHIPPING_THRESHOLD.toFixed(0)}</span>
      </div>
      <div className="h-1 w-full bg-vitrine rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${free ? "bg-gold" : "bg-bone-muted/30"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
