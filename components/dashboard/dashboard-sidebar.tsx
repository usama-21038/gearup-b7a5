"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "./sidebar-config";

export function DashboardSidebar({ items, roleLabel }: { items: SidebarItem[]; roleLabel: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  return (
    <nav className="space-y-1">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{roleLabel}</p>
      {items.map((item) => {
        const [itemPath, itemQuery] = item.href.split("?");
        const itemTab = itemQuery ? new URLSearchParams(itemQuery).get("tab") : null;
        const isActive = pathname === itemPath && (itemTab ?? null) === (currentTab ?? null);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
