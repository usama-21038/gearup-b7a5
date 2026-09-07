import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminUsersPage() {
  return <DashboardShell role="Admin"><RoutePlaceholder title="User management" description="Admin user management foundation." /></DashboardShell>;
}