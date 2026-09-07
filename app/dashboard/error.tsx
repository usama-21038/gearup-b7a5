"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="dash-main" style={{ margin: "0 auto" }}>
      <ErrorState message="Something went wrong loading your dashboard. Please try again." onRetry={reset} />
    </div>
  );
}
