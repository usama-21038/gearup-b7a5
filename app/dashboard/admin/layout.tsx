"use client";

import type { ReactNode } from "react";
import { useRoleGuard } from "@/lib/use-role-guard";
import { DashboardShell } from "@/components/dashboard-shell";
import { adminNavItems } from "@/components/nav-items";
import { Spinner } from "@/components/ui";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { ready } = useRoleGuard("ADMIN");

  if (!ready) {
    return (
      <div className="section-tight wrap" style={{ textAlign: "center", padding: "80px 0" }}>
        <Spinner dark />
      </div>
    );
  }

  return <DashboardShell items={adminNavItems}>{children}</DashboardShell>;
}
