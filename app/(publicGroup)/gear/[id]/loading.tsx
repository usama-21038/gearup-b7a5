import { PageContainer, Skeleton } from "@/components/ui/gearup";

export default function GearDetailsLoading() {
  return <main aria-busy="true" className="py-10 sm:py-16"><PageContainer><Skeleton className="mb-4 h-8 w-32" /><div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]"><div><Skeleton className="aspect-[4/3] w-full" /><Skeleton className="mt-3 h-16 w-80" /><Skeleton className="mt-11 h-12 w-full" /><Skeleton className="mt-6 h-24 w-full" /></div><div><Skeleton className="h-[620px] w-full rounded-xl" /></div></div></PageContainer></main>;
}