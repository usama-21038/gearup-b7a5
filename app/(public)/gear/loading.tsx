import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-gear py-10">
      <Skeleton className="mb-2 h-9 w-64" />
      <Skeleton className="mb-8 h-5 w-96" />
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
