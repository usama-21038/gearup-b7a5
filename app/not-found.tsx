import Link from "next/link";
import { SearchIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="auth-shell">
      <div className="card auth-card" style={{ textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--color-gray-tint)",
            color: "var(--color-text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}
        >
          <SearchIcon size={24} />
        </div>
        <h1 className="text-h2">Page not found</h1>
        <p className="text-body" style={{ margin: "10px 0 24px" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link href="/" className="btn btn-primary btn-block">
          Back to home
        </Link>
      </div>
    </div>
  );
}
