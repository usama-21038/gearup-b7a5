"use client";

import type { ReactNode } from "react";
import { BoxIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

export function EmptyState({
  title,
  body,
  ctaLabel,
  onCta,
  icon,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  onCta?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="state-block">
      <div className="state-icon">{icon || <BoxIcon size={20} />}</div>
      <h3>{title}</h3>
      <p>{body}</p>
      {ctaLabel && onCta && (
        <button className="btn btn-primary btn-sm" onClick={onCta}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state-block card">
      <div className="state-icon" style={{ background: "var(--color-error-tint)", color: "var(--color-error)" }}>
        <BoxIcon size={20} />
      </div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Spinner({ dark }: { dark?: boolean }) {
  return <span className={`spinner ${dark ? "spinner-dark" : ""}`} />;
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeftIcon size={14} />
      </button>
      {pages.map((p) => (
        <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button className="page-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRightIcon size={14} />
      </button>
    </div>
  );
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-val">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="field-error">
      <AlertTriangleGlyph />
      {message}
    </div>
  );
}

function AlertTriangleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}
