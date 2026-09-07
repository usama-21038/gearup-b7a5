import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminGearPage() {
  return <DashboardShell role="Admin"><RoutePlaceholder title="Gear moderation" description="Admin gear moderation foundation." /></DashboardShell>;
}