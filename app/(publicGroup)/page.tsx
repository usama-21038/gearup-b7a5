import { ErrorState, EmptyState, PageContainer, ResponsiveGrid, Typography } from "@/components/ui/gearup";
import { GearCard } from "@/components/gear/gear-card";
import { getGear } from "@/service/gear/gearService";
import type { Gear } from "@/types/gear";
import { Bike, Dumbbell, Footprints, Mountain, TentTree, Trophy, Waves } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const categoryIcons = {
  Cycling: Bike,
  Camping: TentTree,
  Hiking: Footprints,
  "Water Sports": Waves,
  "Team Sports": Trophy,
  Fitness: Dumbbell,
} as const;

function uniqueCategories(gear: Gear[]) {
  return [...new Set(gear.map((item) => item.category).filter(Boolean))];
}

function averageRating(gear: Gear[]) {
  const ratings = gear.map((item) => item.provider?.rating).filter((rating): rating is number => typeof rating === "number");
  if (ratings.length === 0) return "-";
  return (ratings.reduce((total, rating) => total + rating, 0) / ratings.length).toFixed(1);
}

function HomeError() {
  return <PageContainer className="py-16"><ErrorState title="We could not load GearUp" description="The gear catalogue is temporarily unavailable. Please try again shortly." /></PageContainer>;
}

async function loadHomeGear() {
  try {
    const response = await getGear();
    if (!response.success) return null;
    return { gear: response.data ?? [], total: response.meta?.total };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const result = await loadHomeGear();
  if (!result) return <HomeError />;

  const { gear, total } = result;

  const categories = uniqueCategories(gear);
  const providerCount = new Set(gear.map((item) => item.provider?.id ?? item.provider?.name).filter(Boolean)).size;
  const listedCount = total ?? gear.length;
  const featuredGear = gear.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border px-0 py-14 sm:py-[88px]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1180 420" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 360 C 180 300, 260 380, 420 320 S 700 260, 860 330 S 1100 300, 1220 340" stroke="#dce7fe" strokeWidth="2" fill="none" />
          <path d="M-20 300 C 180 250, 260 320, 420 270 S 700 210, 860 270 S 1100 250, 1220 280" stroke="#dce7fe" strokeWidth="2" fill="none" />
          <path d="M-20 240 C 180 200, 260 260, 420 220 S 700 170, 860 220 S 1100 200, 1220 230" stroke="#e7effe" strokeWidth="2" fill="none" />
          <path d="M-20 180 C 180 150, 260 200, 420 170 S 700 130, 860 170 S 1100 150, 1220 175" stroke="#eef4ff" strokeWidth="2" fill="none" />
        </svg>
        <PageContainer className="relative z-10">
          <div className="max-w-[640px]">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-[13px] font-semibold text-secondary-foreground">Find gear near you</span>
            <Typography as="h1" variant="display">Gear up. Get outside.</Typography>
            <Typography variant="body" className="mb-7 mt-[18px] max-w-[480px]">Find and rent the sports and outdoor equipment you need, exactly when you need it, from bikes and tents to kayaks and rackets.</Typography>
            <div className="mb-9 flex flex-wrap gap-3">
              <Button size="lg" asChild><Link href="/gear">Browse gear</Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/register">List your gear</Link></Button>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-9">
              <Stat value={listedCount.toLocaleString()} label="Gear items listed" />
              <Stat value={providerCount.toLocaleString()} label="Providers listed" />
              <Stat value={averageRating(gear)} label="Average rating" />
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="py-10 sm:py-16">
        <PageContainer>
          <div className="mb-7 flex items-center justify-between gap-4"><Typography as="h2" variant="h2">Featured gear</Typography><Link href="/gear" className="text-sm font-semibold text-primary hover:underline">View all gear <span aria-hidden="true">→</span></Link></div>
          {featuredGear.length > 0 ? <ResponsiveGrid columns={3}>{featuredGear.map((item) => <GearCard gear={item} key={item.id} />)}</ResponsiveGrid> : <div className="rounded-xl border border-border bg-card"><EmptyState title="No gear listed yet" description="Check back soon for sports and outdoor equipment from local providers." action={<Button asChild><Link href="/register">Become a provider</Link></Button>} /></div>}
        </PageContainer>
      </section>

      <section className="border-y border-border bg-card py-10 sm:py-16">
        <PageContainer>
          <Typography as="h2" variant="h2" className="mb-6">Browse by category</Typography>
          {categories.length > 0 ? <ResponsiveGrid columns={4}>{categories.map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons] ?? Mountain;
            const count = gear.filter((item) => item.category === category && item.available).length;
            return <Link href={`/gear?category=${encodeURIComponent(category)}`} key={category} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"><span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary"><Icon className="size-5" /></span><span><strong className="block text-[15px]">{category}</strong><span className="text-sm text-muted-foreground">{count} available</span></span></Link>;
          })}</ResponsiveGrid> : <div className="rounded-xl border border-border"><EmptyState title="Categories are coming soon" description="Once gear is listed, you will be able to browse it by category." /></div>}
        </PageContainer>
      </section>

      <section className="py-10 sm:py-16">
        <PageContainer>
          <Typography as="h2" variant="h2" className="mb-2">How it works</Typography>
          <Typography variant="body" className="mb-8">Three steps between you and your next adventure.</Typography>
          <div className="grid gap-8 md:grid-cols-3">
            <Step number="1" title="Find your gear">Search and filter equipment by category, price, and availability near you.</Step>
            <Step number="2" title="Choose your dates">Pick pickup and return dates so you only see gear that is free for your trip.</Step>
            <Step number="3" title="Rent and enjoy">Pay securely online, pick up your gear, and get outside. Return it when you are done.</Step>
          </div>
        </PageContainer>
      </section>

      <section className="mx-4 mb-10 rounded-2xl bg-foreground px-5 py-12 text-center sm:mx-auto sm:mb-16 sm:max-w-[1180px] sm:px-10 sm:py-16">
        <Typography as="h2" variant="h2" className="text-background">Ready for your next adventure?</Typography>
        <p className="mx-auto mb-6 mt-2.5 max-w-md text-sm text-slate-400">Explore equipment from providers near you and make your next outing easier to plan.</p>
        <Button size="lg" asChild><Link href="/gear">Browse gear</Link></Button>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div><strong className="block text-[22px] tracking-[-0.02em]">{value}</strong><span className="text-sm text-muted-foreground">{label}</span></div>;
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <div><span className="mb-3.5 flex size-[34px] items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">{number}</span><Typography as="h3" variant="h3" className="mb-2">{title}</Typography><Typography variant="body">{children}</Typography></div>;
}
