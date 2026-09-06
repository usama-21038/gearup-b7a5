import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-gear py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
