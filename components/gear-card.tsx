"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GearItem } from "@/lib/types";
import { fmtCurrency } from "@/lib/utils";
import { AvailabilityBadge } from "./badges";
import { CategoryIcon, StarIcon, categoryTintClass } from "./icons";

export function GearMedia({ gear, className }: { gear: Pick<GearItem, "images" | "category">; className?: string }) {
  const [failed, setFailed] = useState(false);
  const image = gear.images?.[0];
  const tintClass = categoryTintClass(gear.category.name);

  if (image && !failed) {
    return (
      <div className={`gear-media ${className || ""}`}>
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return (
    <div className={`gear-media ${tintClass} ${className || ""}`}>
      <CategoryIcon category={gear.category.name} size={64} />
    </div>
  );
}

export function GearCard({ gear }: { gear: GearItem }) {
  const avgRating =
    gear.reviews && gear.reviews.length > 0
      ? (gear.reviews.reduce((sum, r) => sum + r.rating, 0) / gear.reviews.length).toFixed(1)
      : null;

  return (
    <Link href={`/gear/${gear.id}`} className="gear-card">
      <div style={{ position: "relative" }}>
        <GearMedia gear={gear} />
        <div className="gear-avail-badge">
          <AvailabilityBadge availableQuantity={gear.availableQuantity} />
        </div>
      </div>
      <div className="gear-body">
        <span className="gear-cat">{gear.category.name}</span>
        <span className="gear-name">{gear.name}</span>
        <div className="gear-rating">
          <StarIcon />
          <span>{avgRating ?? "New"}</span>
          {gear.reviews && <span>({gear.reviews.length})</span>}
        </div>
        <div className="gear-foot">
          <div className="gear-price">
            <b>{fmtCurrency(gear.pricePerDay)}</b>
            <span> /day</span>
          </div>
          <span className="btn btn-secondary btn-sm">View</span>
        </div>
      </div>
    </Link>
  );
}

export function GearCardSkeleton() {
  return (
    <div className="skel-card">
      <div className="skel skel-media" />
      <div className="skel skel-line" style={{ width: "40%" }} />
      <div className="skel skel-line" style={{ width: "75%" }} />
      <div className="skel skel-line" style={{ width: "50%" }} />
    </div>
  );
}
