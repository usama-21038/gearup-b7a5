import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CustomerOrderDetailsPage() {
  return <DashboardShell role="Customer"><RoutePlaceholder title="Order details" description="Rental order detail foundation." /></DashboardShell>;
}