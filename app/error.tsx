"use client";

import { useEffect } from "react";
import Link from "next/link";
import { XCircleIcon } from "@/components/icons";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="auth-shell">
      <div className="card auth-card" style={{ textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--color-error-tint)",
            color: "var(--color-error)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}
        >
          <XCircleIcon size={28} />
        </div>
        <h1 className="text-h2">Something went wrong</h1>
        <p className="text-body" style={{ margin: "10px 0 24px" }}>
          An unexpected error occurred while loading this page. You can try again, or head back home.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary btn-block" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="btn btn-outline btn-block">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
