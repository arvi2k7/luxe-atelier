export function calculatePointsEarned(subtotal: number, tier: string): number {
  const multipliers: Record<string, number> = { bronze: 1, silver: 1.5, gold: 2, platinum: 3 };
  return Math.floor(subtotal * (multipliers[tier] ?? 1));
}

export function pointsToDiscount(points: number): number {
  return points / 100;
}

export const TIER_THRESHOLDS: Record<string, number> = { bronze: 0, silver: 500, gold: 2000, platinum: 5000 };
export const TIER_NAMES: Record<string, string> = { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" };

export function calculateTier(points: number): { name: string; threshold: number; nextTier: { name: string; pointsNeeded: number } | null } {
  const sorted = Object.entries(TIER_THRESHOLDS).sort(([, a], [, b]) => b - a);
  let currentTier = "bronze";
  for (const [tier, threshold] of sorted) {
    if (points >= threshold) { currentTier = tier; break; }
  }
  const tierNames = Object.keys(TIER_THRESHOLDS);
  const currentIndex = tierNames.indexOf(currentTier);
  const nextTier = currentIndex < tierNames.length - 1
    ? { name: TIER_NAMES[tierNames[currentIndex + 1]], pointsNeeded: TIER_THRESHOLDS[tierNames[currentIndex + 1]] }
    : null;
  return { name: TIER_NAMES[currentTier], threshold: TIER_THRESHOLDS[currentTier], nextTier };
}
