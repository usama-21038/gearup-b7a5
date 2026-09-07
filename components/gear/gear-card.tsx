import Image from "next/image";
import Link from "next/link";
import type { Gear } from "@/types/gear";
import { Card } from "@/components/ui/card";

export function GearCard({ gear }: { gear: Gear }) {
  const image = gear.images?.[0];

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        {image ? (
          <Image alt={gear.name} className="object-cover" fill src={image} />
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs text-muted-foreground">{gear.category}</p>
        <h2 className="font-semibold">{gear.name}</h2>
        <p className="text-sm text-muted-foreground">
          ${gear.pricePerDay}/day
        </p>
        <Link className="text-sm font-medium text-primary hover:underline" href={`/gear/${gear.id}`}>
          View gear
        </Link>
      </div>
    </Card>
  );
}