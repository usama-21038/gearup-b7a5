import { Badge } from "@/components/ui/badge";
import type { RentalStatus, PaymentStatus, GearStatus, UserStatus } from "@/lib/types";

const RENTAL_STATUS_MAP: Record<RentalStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  PLACED: { label: "Placed", variant: "warning" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  PAID: { label: "Paid", variant: "accent" },
  PICKED_UP: { label: "Picked up", variant: "success" },
  RETURNED: { label: "Returned", variant: "secondary" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const info = RENTAL_STATUS_MAP[status];
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  PENDING: { label: "Pending", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "success" },
  FAILED: { label: "Failed", variant: "destructive" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const info = PAYMENT_STATUS_MAP[status];
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

export function GearStatusBadge({ status }: { status: GearStatus }) {
  return <Badge variant={status === "ACTIVE" ? "success" : "secondary"}>{status === "ACTIVE" ? "Active" : "Inactive"}</Badge>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge variant={status === "ACTIVE" ? "success" : "destructive"}>{status === "ACTIVE" ? "Active" : "Suspended"}</Badge>;
}
