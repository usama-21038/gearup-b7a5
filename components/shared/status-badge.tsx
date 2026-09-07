import type { RentalStatus } from "@/types/rental";
import { Badge } from "@/components/ui/gearup";

const statusLabels: Record<RentalStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: RentalStatus }) {
  return <Badge tone={status.toLowerCase() as Parameters<typeof Badge>[0]["tone"]}>{statusLabels[status]}</Badge>;
}