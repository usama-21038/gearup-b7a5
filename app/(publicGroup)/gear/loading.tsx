import { PageContainer, Skeleton, SkeletonCard } from "@/components/ui/gearup";

export default function GearLoading() {
  return <main aria-busy="true" className="py-10 sm:py-16"><PageContainer><Skeleton className="h-12 w-56" /><Skeleton className="mt-2 h-5 w-80" /><div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]"><div className="hidden lg:block"><Skeleton className="h-5 w-24" /><Skeleton className="mt-4 h-24 w-full" /><Skeleton className="mt-6 h-5 w-32" /><Skeleton className="mt-4 h-2 w-full" /></div><div><div className="mb-5 flex gap-3"><Skeleton className="h-11 flex-1" /><Skeleton className="h-11 w-40" /></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></div></div></PageContainer></main>;
}