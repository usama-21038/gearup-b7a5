"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { LogoutIcon } from "./icons";

export interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
}

export function DashboardShell({ items, children }: { items: SidebarItem[]; children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="dash-shell">
      <div className="dash-sidebar">
        <span className="dash-role-tag">{user ? `${user.role.charAt(0)}${user.role.slice(1).toLowerCase()} account` : ""}</span>
        <div className="dash-nav">
          {items.map((it) => {
            const active = it.href === pathname || (it.href !== "/dashboard/customer" && it.href !== "/dashboard/provider" && it.href !== "/dashboard/admin" && pathname?.startsWith(it.href));
            return (
              <Link key={it.key} href={it.href} className={active ? "active" : ""}>
                {it.icon}
                {it.label}
              </Link>
            );
          })}
          <hr className="divider" style={{ margin: "10px 0" }} />
          <button onClick={logout}>
            <LogoutIcon /> Log out
          </button>
        </div>
      </div>
      <div className="dash-main">{children}</div>
    </div>
  );
}
