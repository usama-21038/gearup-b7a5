import Link from "next/link";
import { Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-display text-xl font-bold tracking-tight", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Mountain className="h-4.5 w-4.5" />
      </span>
      GearUp
    </Link>
  );
}
