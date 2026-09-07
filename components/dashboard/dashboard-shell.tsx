import type { UserRole } from "@/types/auth";
import { DashboardNav, dashboardNavItems } from "./dashboard-nav";

export function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-0 px-4 sm:px-6 lg:grid-cols-[236px_1fr] lg:px-0">
      <DashboardNav items={dashboardNavItems[role]} />
      <section className="min-w-0 px-0 py-6 lg:px-8 lg:py-8">{children}</section>
    </div>
  );
}