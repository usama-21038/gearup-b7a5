import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CustomerOrdersPage() {
  return <DashboardShell role="Customer"><RoutePlaceholder title="Customer orders" description="Rental order history foundation." /></DashboardShell>;
}