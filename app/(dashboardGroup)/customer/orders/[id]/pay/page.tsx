import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CustomerPaymentPage() {
  return <DashboardShell role="Customer"><RoutePlaceholder title="Checkout" description="Payment initiation foundation." /></DashboardShell>;
}