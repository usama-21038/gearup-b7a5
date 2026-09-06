import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, User as UserIcon } from "lucide-react";
import { GearGallery } from "@/components/gear/gear-gallery";
import { RentForm } from "@/components/gear/rent-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { apiFetch, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";
import { formatCurrency, formatDate } from "@/lib/utils";
import { averageRating } from "@/components/gear/gear-utils";
import type { GearItem } from "@/lib/types";

async function getGear(id: string) {
  try {
    return await apiFetch<GearItem>(`/gear/${id}`, { auth: false, next: { revalidate: 30 } });
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }
}

export default async function GearDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [gear, session] = await Promise.all([getGear(id), getSession()]);

  if (!gear) notFound();

  const rating = averageRating(gear);

  return (
    <div className="container-gear py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <GearGallery images={gear.images} alt={gear.name} />

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{gear.category?.name ?? "Gear"}</Badge>
              {gear.brand && <span className="text-sm text-muted-foreground">{gear.brand}</span>}
            </div>
            <h1 className="font-display text-3xl font-bold">{gear.name}</h1>
            {rating !== null && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {rating} · {gear.reviews?.length} review{gear.reviews?.length === 1 ? "" : "s"}
              </p>
            )}
          </div>

          <p className="font-display text-2xl font-bold">
            {formatCurrency(gear.pricePerDay)} <span className="text-base font-normal text-muted-foreground">/ day</span>
          </p>

          {gear.description && <p className="leading-relaxed text-foreground/90">{gear.description}</p>}

          {gear.provider && (
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <UserIcon className="h-4 w-4" />
              </span>
              <div className="text-sm">
                <p className="font-medium">{gear.provider.name}</p>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Verified GearUp provider
                </p>
              </div>
            </div>
          )}

          {session ? (
            <RentForm
              gearId={gear.id}
              pricePerDay={Number(gear.pricePerDay)}
              availableQuantity={gear.availableQuantity}
              sessionRole={session.role}
            />
          ) : (
            <div className="rounded-lg border border-border bg-secondary/50 p-5 text-center">
              <p className="mb-3 text-sm text-muted-foreground">Log in to pick dates and rent this gear.</p>
              <Button variant="accent" asChild>
                <Link href={`/login?redirectTo=/gear/${gear.id}`}>Log in to rent</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-12" />

      <section className="mx-auto max-w-2xl">
        <h2 className="mb-4 font-display text-xl font-bold">Reviews</h2>
        {!gear.reviews || gear.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet — be the first to rent and review this gear.</p>
        ) : (
          <ul className="space-y-4">
            {gear.reviews.map((review) => (
              <li key={review.id} className="rounded-lg border border-border p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium">{review.customer?.name ?? "GearUp customer"}</p>
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {review.rating}
                  </span>
                </div>
                {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
