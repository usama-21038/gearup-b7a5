"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function GearGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = React.useState(0);
  const shown = images.length > 0 ? images : [`https://picsum.photos/seed/gearup-${encodeURIComponent(alt)}/900/700`];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
        <Image src={shown[active]} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
      </div>
      {shown.length > 1 && (
        <div className="flex gap-2">
          {shown.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
