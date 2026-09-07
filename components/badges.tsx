import type { RentalStatus, UserStatus } from "@/lib/types";
import { RENTAL_STATUS_LABEL } from "@/lib/utils";

export function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {RENTAL_STATUS_LABEL[status] || status}
    </span>
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {status === "ACTIVE" ? "Active" : "Suspended"}
    </span>
  );
}

export function AvailabilityBadge({ availableQuantity }: { availableQuantity: number }) {
  if (availableQuantity <= 0) {
    return (
      <span className="badge badge-outline">
        <span className="avail-dot" style={{ background: "var(--color-error)" }} />
        Unavailable
      </span>
    );
  }
  return (
    <span className="badge" style={{ background: "var(--color-success-tint)", color: "var(--color-success-text)" }}>
      <span className="avail-dot" style={{ background: "var(--color-success)" }} />
      Available
    </span>
  );
}
