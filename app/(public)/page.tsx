import Link from "next/link";
import { ArrowRight, ShieldCheck, CalendarRange, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GearCard } from "@/components/gear/gear-card";
import { apiFetch } from "@/lib/api";
import type { Category, GearItem } from "@/lib/types";

async function getFeaturedGear() {
  try {
    return await apiFetch<GearItem[]>("/gear?limit=8", { auth: false, next: { revalidate: 60 } });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await apiFetch<Category[]>("/categories", { auth: false, next: { revalidate: 300 } });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [gear, categories] = await Promise.all([getFeaturedGear(), getCategories()]);

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-gear grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center gap-6">
            <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
              Sports & outdoor gear, by the day
            </span>
            <h1 className="max-w-md font-display text-4xl font-bold leading-[1.05] md:text-5xl">
              Gear up for the trip without buying the gear.
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Rent tents, bikes, skis, kayaks and more from local providers. Pick your dates,
              pay securely, drop it back — no storage, no upkeep, no regret purchases.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" variant="accent" asChild>
                <Link href="/gear">
                  Browse gear <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">List your gear</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            <FeatureStat icon={CalendarRange} label="Book by the day" detail="Pick exact rental dates, no long-term commitment." />
            <FeatureStat icon={ShieldCheck} label="Verified providers" detail="Every listing is tied to a real rental shop or owner." />
            <FeatureStat icon={Wallet} label="Secure checkout" detail="Card payments handled through Stripe." />
            <FeatureStat icon={ArrowRight} label="Easy returns" detail="Mark it returned, leave a review, done." />
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container-gear py-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/gear?category=${encodeURIComponent(c.name)}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-gear py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">Featured gear</h2>
          <Link href="/gear" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {gear.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
            No gear listed yet — check back soon, or{" "}
            <Link href="/register" className="text-primary underline underline-offset-2">
              list your own gear
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gear.map((item) => (
              <GearCard key={item.id} gear={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeatureStat({
  icon: Icon,
  label,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <Icon className="mb-2 h-5 w-5 text-accent" />
      <p className="font-medium leading-tight">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
