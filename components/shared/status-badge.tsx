import type { RentalStatus } from "@/types/rental";

const statusLabels: Record<RentalStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium">
      {statusLabels[status]}
    </span>
  );
}