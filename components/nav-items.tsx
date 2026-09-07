import {
  BoxIcon,
  GaugeIcon,
  HomeIcon,
  OrdersIcon,
  PlusIcon,
  ReviewIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from "./icons";
import type { SidebarItem } from "./dashboard-shell";

export const customerNavItems: SidebarItem[] = [
  { key: "dash", label: "Dashboard", href: "/dashboard/customer", icon: <HomeIcon /> },
  { key: "orders", label: "My Orders", href: "/dashboard/customer/orders", icon: <OrdersIcon /> },
  { key: "payments", label: "Payment History", href: "/dashboard/customer/payments", icon: <WalletIcon /> },
  { key: "reviews", label: "Reviews", href: "/dashboard/customer/reviews", icon: <ReviewIcon /> },
  { key: "profile", label: "Profile", href: "/dashboard/customer/profile", icon: <UserIcon /> },
];

export const providerNavItems: SidebarItem[] = [
  { key: "dash", label: "Dashboard", href: "/dashboard/provider", icon: <HomeIcon /> },
  { key: "inventory", label: "My Gear", href: "/dashboard/provider/gear", icon: <BoxIcon /> },
  { key: "add", label: "Add Gear", href: "/dashboard/provider/gear/new", icon: <PlusIcon /> },
  { key: "orders", label: "Orders", href: "/dashboard/provider/orders", icon: <OrdersIcon /> },
  { key: "profile", label: "Profile", href: "/dashboard/provider/profile", icon: <UserIcon /> },
];

export const adminNavItems: SidebarItem[] = [
  { key: "dash", label: "Dashboard", href: "/dashboard/admin", icon: <GaugeIcon /> },
  { key: "users", label: "Users", href: "/dashboard/admin/users", icon: <UsersIcon /> },
  { key: "gear", label: "Gear", href: "/dashboard/admin/gear", icon: <BoxIcon /> },
  { key: "orders", label: "Orders", href: "/dashboard/admin/orders", icon: <OrdersIcon /> },
  { key: "categories", label: "Categories", href: "/dashboard/admin/categories", icon: <ShieldIcon /> },
  { key: "profile", label: "Profile", href: "/dashboard/admin/profile", icon: <UserIcon /> },
];
