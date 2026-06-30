"use client";

interface LoyaltyData {
  points: number;
  tier: { name: string; threshold: number; nextTier: { name: string; pointsNeeded: number } | null };
  referralCode?: string;
}

export function LoyaltyDisplay({ data }: { data: LoyaltyData }) {
  const { points, tier, referralCode } = data;
  const progress = tier.nextTier
    ? ((points - tier.threshold) / (tier.nextTier.pointsNeeded - tier.threshold)) * 100
    : 100;

  return (
    <div className="border border-gold/20 bg-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold">Loyalty</h2>
        <span className="text-xs uppercase tracking-[0.1em] text-gold-bright">{tier.name}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl text-bone">{points}</span>
        <span className="text-xs text-bone-muted">points</span>
      </div>

      <div className="mt-3 h-1.5 w-full bg-vitrine rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>

      {tier.nextTier && (
        <p className="mt-2 text-xs text-bone-muted">
          {tier.nextTier.pointsNeeded - points} more points to {tier.nextTier.name}
        </p>
      )}

      {referralCode && (
        <div className="mt-4 border-t border-gold/10 pt-4">
          <p className="text-xs text-bone-muted">Referral code</p>
          <p className="font-mono text-sm text-gold-bright mt-1">{referralCode}</p>
          <p className="text-xs text-bone-muted mt-1">
            Share your code with friends. When they place their first order, both you and they earn bonus points.
          </p>
        </div>
      )}
    </div>
  );
}
