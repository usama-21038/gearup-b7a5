import type { GearItem } from "@/lib/types";

/** Deterministic placeholder so gear without photos still looks intentional, not broken. */
export function gearImage(gear: Pick<GearItem, "id" | "images">, index = 0): string {
  if (gear.images && gear.images[index]) return gear.images[index];
  return `https://picsum.photos/seed/gearup-${gear.id}/800/600`;
}

export function averageRating(gear: Pick<GearItem, "reviews">): number | null {
  if (!gear.reviews || gear.reviews.length === 0) return null;
  const total = gear.reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / gear.reviews.length) * 10) / 10;
}
