"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/components/ui";

export default function GearError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap section-tight">
      <ErrorState message="Couldn't load gear right now. Please try again." onRetry={reset} />
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Link href="/" className="link-btn">
          Back to home
        </Link>
      </div>
    </div>
  );
}
