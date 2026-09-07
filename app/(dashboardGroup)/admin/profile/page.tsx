import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminProfilePage() {
  return <DashboardShell role="Admin"><RoutePlaceholder title="Admin profile" description="Admin account foundation." /></DashboardShell>;
}