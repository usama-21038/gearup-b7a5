import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CustomerPaymentsPage() {
  return <DashboardShell role="Customer"><RoutePlaceholder title="Payment history" description="Customer payment history foundation." /></DashboardShell>;
}