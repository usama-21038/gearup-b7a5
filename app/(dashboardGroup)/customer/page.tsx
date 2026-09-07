import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CustomerDashboardPage() {
  return <DashboardShell role="Customer"><RoutePlaceholder title="Customer dashboard" description="Rental overview foundation." /></DashboardShell>;
}