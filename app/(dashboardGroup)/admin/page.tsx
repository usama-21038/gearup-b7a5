import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminDashboardPage() {
  return <DashboardShell role="Admin"><RoutePlaceholder title="Admin dashboard" description="Platform moderation foundation." /></DashboardShell>;
}