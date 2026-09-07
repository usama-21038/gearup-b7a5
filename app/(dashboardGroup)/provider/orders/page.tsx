import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function ProviderOrdersPage() {
  return <DashboardShell role="Provider"><RoutePlaceholder title="Provider orders" description="Incoming rental order foundation." /></DashboardShell>;
}