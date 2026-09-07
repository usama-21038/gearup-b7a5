"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/auth";

export type DashboardNavItem = {
  label: string;
  href: string;
};

export const dashboardNavItems: Record<UserRole, DashboardNavItem[]> = {
  Customer: [
    { label: "Dashboard", href: "/dashboard/customer" },
    { label: "Orders", href: "/dashboard/customer/orders" },
    { label: "Payments", href: "/dashboard/customer/payments" },
    { label: "Reviews", href: "/dashboard/customer/reviews" },
    { label: "Profile", href: "/dashboard/customer/profile" },
  ],
  Provider: [
    { label: "Dashboard", href: "/dashboard/provider" },
    { label: "Inventory", href: "/dashboard/provider/gear" },
    { label: "Orders", href: "/dashboard/provider/orders" },
    { label: "Profile", href: "/dashboard/provider/profile" },
  ],
  Admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Gear", href: "/admin/gear" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Profile", href: "/admin/profile" },
  ],
};

export function DashboardNav({ items }: { items: DashboardNavItem[] }) {
  const pathname = usePathname();
  return (
    <aside className="border-b border-border bg-card px-0 py-4 lg:min-h-[calc(100vh-68px)] lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      <nav aria-label="Dashboard navigation" className="flex gap-1 overflow-x-auto lg:sticky lg:top-[92px] lg:flex-col">
      {items.map((item) => (
        <Link
          className={`whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted hover:text-foreground ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
      </nav>
    </aside>
  );
}