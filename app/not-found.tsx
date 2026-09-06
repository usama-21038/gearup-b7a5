import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Compass className="h-7 w-7 text-muted-foreground" />
      </span>
      <h1 className="font-display text-3xl font-bold">404 — Off the trail</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        We couldn&apos;t find that page. It may have been moved, or the gear listing was removed.
      </p>
      <div className="flex gap-3 pt-2">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/gear">Browse gear</Link>
        </Button>
      </div>
    </div>
  );
}
