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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardNav items={dashboardNavItems[role]} />
      <section>{children}</section>
    </div>
  );
}