import { Skeleton, SkeletonCard } from "@/components/ui/gearup";
import { PageContainer } from "@/components/ui/gearup";

export default function PublicLoading() {
  return <main aria-busy="true" className="py-14 sm:py-[88px]"><PageContainer><div className="max-w-[640px]"><Skeleton className="mb-5 h-7 w-32" /><Skeleton className="h-16 w-full max-w-[560px]" /><Skeleton className="mt-5 h-5 w-full max-w-[480px]" /><Skeleton className="mt-2 h-5 w-4/5 max-w-[420px]" /><div className="mt-8 flex gap-3"><Skeleton className="h-12 w-36" /><Skeleton className="h-12 w-36" /></div></div><section className="mt-16"><Skeleton className="mb-7 h-9 w-56" /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></section></PageContainer></main>;
}
