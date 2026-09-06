import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, PackageSearch, ListOrdered, Users, Boxes, Tags, ClipboardList } from "lucide-react";

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const customerSidebar: SidebarItem[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/gear", label: "Browse gear", icon: PackageSearch },
];

export const providerSidebar: SidebarItem[] = [
  { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/provider?tab=inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/provider?tab=orders", label: "Orders", icon: ClipboardList },
];

export const adminSidebar: SidebarItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin?tab=users", label: "Users", icon: Users },
  { href: "/dashboard/admin?tab=gear", label: "Gear", icon: Boxes },
  { href: "/dashboard/admin?tab=rentals", label: "Rentals", icon: ListOrdered },
  { href: "/dashboard/admin?tab=categories", label: "Categories", icon: Tags },
];
