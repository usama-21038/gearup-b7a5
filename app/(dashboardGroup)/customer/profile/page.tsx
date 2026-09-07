import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CustomerProfilePage() {
  return <DashboardShell role="Customer"><RoutePlaceholder title="Customer profile" description="Account profile foundation." /></DashboardShell>;
}