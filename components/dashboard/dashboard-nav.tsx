import Link from "next/link";
import type { UserRole } from "@/types/auth";

export type DashboardNavItem = {
  label: string;
  href: string;
};

export const dashboardNavItems: Record<UserRole, DashboardNavItem[]> = {
  Customer: [
    { label: "Dashboard", href: "/customer" },
    { label: "Orders", href: "/customer/orders" },
    { label: "Payments", href: "/customer/payments" },
    { label: "Reviews", href: "/customer/reviews" },
    { label: "Profile", href: "/customer/profile" },
  ],
  Provider: [
    { label: "Dashboard", href: "/provider" },
    { label: "Inventory", href: "/provider/gear" },
    { label: "Orders", href: "/provider/orders" },
    { label: "Profile", href: "/provider/profile" },
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
  return (
    <nav aria-label="Dashboard navigation" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}