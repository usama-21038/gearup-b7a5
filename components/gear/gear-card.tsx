import Image from "next/image";
import Link from "next/link";
import { Star, PackageX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { gearImage, averageRating } from "./gear-utils";
import type { GearItem } from "@/lib/types";

export function GearCard({ gear }: { gear: GearItem }) {
  const rating = averageRating(gear);
  const outOfStock = gear.availableQuantity <= 0;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={gearImage(gear)}
          alt={gear.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge variant="secondary" className="absolute left-3 top-3 bg-background/90">
          {gear.category?.name ?? "Gear"}
        </Badge>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-background/80 text-sm font-medium text-muted-foreground">
            <PackageX className="h-4 w-4" /> Fully booked
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug">{gear.name}</h3>
          {rating !== null && (
            <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {rating}
            </span>
          )}
        </div>
        {gear.brand && <p className="text-sm text-muted-foreground">{gear.brand}</p>}
        <div className="mt-auto flex items-baseline gap-1 pt-2">
          <span className="font-display text-lg font-bold">{formatCurrency(gear.pricePerDay)}</span>
          <span className="text-sm text-muted-foreground">/ day</span>
        </div>
      </div>
    </Link>
  );
}
