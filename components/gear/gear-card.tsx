"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Package } from "lucide-react";
import { useState } from "react";
import type { Gear } from "@/types/gear";
import { Badge } from "@/components/ui/gearup";
import { cn } from "@/lib/utils";

const categoryTints: Record<string, string> = {
  Cycling: "bg-[#eff4ff] text-[#2563eb]",
  Camping: "bg-[#fef3e8] text-[#c2660d]",
  Hiking: "bg-[#eaf7ee] text-[#16803c]",
  "Water Sports": "bg-[#e9f6fa] text-[#0e7c91]",
  "Team Sports": "bg-[#fdeef0] text-[#c22b4e]",
  Fitness: "bg-[#f3eefd] text-[#6d28d9]",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

export function GearCard({ gear }: { gear: Gear }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = gear.images?.[0];
  const hasImage = Boolean(image) && !imageFailed;
  const available = gear.available && gear.stock > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]">
      <Link href={`/gear/${gear.id}`} className={cn("relative flex aspect-[4/3] items-center justify-center overflow-hidden", categoryTints[gear.category] ?? "bg-muted text-muted-foreground")}>
        {hasImage ? (
          <Image src={image!} alt={gear.name} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" onError={() => setImageFailed(true)} />
        ) : (
          <div className="flex flex-col items-center gap-2 text-current" aria-label="No gear image available">
            {image ? <ImageOff className="size-10 opacity-70" /> : <Package className="size-10 opacity-70" />}
            <span className="text-xs font-semibold opacity-75">Image unavailable</span>
          </div>
        )}
        <span className="absolute left-2.5 top-2.5">
          <Badge tone={available ? "available" : "unavailable"} dot>{available ? "Available" : "Unavailable"}</Badge>
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold text-muted-foreground">{gear.category}</span>
        <Link href={`/gear/${gear.id}`} className="line-clamp-2 text-base font-bold tracking-[-0.01em] hover:text-primary">{gear.name}</Link>
        {gear.provider?.rating != null ? <p className="text-[13px] text-muted-foreground">Rated {gear.provider.rating.toFixed(1)} by renters</p> : <p className="text-[13px] text-muted-foreground">{gear.provider?.name ?? "Local provider"}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2.5">
          <p><strong className="text-[17px]">{formatPrice(gear.pricePerDay)}</strong><span className="text-xs text-muted-foreground"> /day</span></p>
          <Link href={`/gear/${gear.id}`} className="rounded-md bg-secondary px-3.5 py-1.5 text-[13px] font-semibold text-secondary-foreground hover:bg-[#e0eafe]">View</Link>
        </div>
      </div>
    </article>
  );
}
