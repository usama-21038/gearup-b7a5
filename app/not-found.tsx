import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-sm text-muted-foreground">Could not find the requested GearUp page.</p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
