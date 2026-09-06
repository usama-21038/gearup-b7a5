"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production you'd forward this to an error-tracking service (Sentry, etc).
    console.error("Unhandled error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          GearUp hit an unexpected error loading this page. This has been logged - try again, or head back home.
        </p>
        <div className="flex gap-3 pt-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
