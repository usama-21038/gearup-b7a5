import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function ProviderDashboardPage() {
  return <DashboardShell role="Provider"><RoutePlaceholder title="Provider dashboard" description="Inventory and rental operations foundation." /></DashboardShell>;
}