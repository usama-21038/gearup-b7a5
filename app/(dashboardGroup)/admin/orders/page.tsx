import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminOrdersPage() {
  return <DashboardShell role="Admin"><RoutePlaceholder title="Order moderation" description="Admin rental order foundation." /></DashboardShell>;
}