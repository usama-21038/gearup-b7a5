import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function ProviderGearPage() {
  return <DashboardShell role="Provider"><RoutePlaceholder title="Provider inventory" description="Gear inventory foundation." /></DashboardShell>;
}