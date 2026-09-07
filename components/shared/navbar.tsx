"use client";

import { logout } from "@/service/auth/logout";
import type { CurrentUserResponse, User } from "@/types/user";
import { LogOut, Menu, Mountain, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Browse Gear", href: "/gear" },
  { label: "Categories", href: "/gear" },
];

function dashboardHref(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "AUTHOR") return "/provider";
  return "/customer";
}

function initials(name?: string) {
  return (name ?? "GearUp")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Navbar({ user }: { user: CurrentUserResponse }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const authenticated = user.success && Boolean(user.data?.profile);
  const profile = user.data?.profile;
  const dashboard = dashboardHref(profile?.role);

  const isActive = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
    setDrawerOpen(false);
    toast.success("Signed out successfully.");
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="gearup-container flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[19px] font-extrabold tracking-[-0.02em]" onClick={() => setDrawerOpen(false)}>
            <span className="flex size-[30px] items-center justify-center rounded-lg bg-primary text-primary-foreground"><Mountain className="size-4" /></span>
            GearUp
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={cn("text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", isActive(item.href) && "text-primary")}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {authenticated ? (
              <AuthenticatedActions profile={profile} dashboard={dashboard} onLogout={handleLogout} />
            ) : (
              <>
                <Button variant="ghost" asChild><Link href="/login">Log in</Link></Button>
                <Button asChild><Link href="/register">Register</Link></Button>
              </>
            )}
          </div>

          <Button variant="outline" size="icon-sm" className="md:hidden" aria-label={drawerOpen ? "Close menu" : "Open menu"} aria-expanded={drawerOpen} onClick={() => setDrawerOpen((open) => !open)}>
            {drawerOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button className="absolute inset-0 h-full w-full bg-slate-900/40" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-[280px] flex-col bg-card p-5 shadow-[var(--shadow-modal)]">
            <div className="mb-5 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-base font-extrabold" onClick={() => setDrawerOpen(false)}>
                <span className="flex size-[30px] items-center justify-center rounded-lg bg-primary text-primary-foreground"><Mountain className="size-4" /></span>
                GearUp
              </Link>
              <Button variant="ghost" size="icon-sm" aria-label="Close menu" onClick={() => setDrawerOpen(false)}><X /></Button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation links">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setDrawerOpen(false)} className={cn("rounded-md px-2.5 py-3 text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground", isActive(item.href) && "bg-secondary text-secondary-foreground")}>
                  {item.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {authenticated ? (
                <>
                  <Link href={dashboard} onClick={() => setDrawerOpen(false)} className="rounded-md px-2.5 py-3 text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Dashboard</Link>
                  <Link href={`${dashboard}/profile`} onClick={() => setDrawerOpen(false)} className="rounded-md px-2.5 py-3 text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Profile</Link>
                  <button className="flex items-center gap-2 rounded-md px-2.5 py-3 text-left text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" onClick={handleLogout}><LogOut className="size-4" />Log out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setDrawerOpen(false)} className="rounded-md px-2.5 py-3 text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Log in</Link>
                  <Link href="/register" onClick={() => setDrawerOpen(false)} className="rounded-md px-2.5 py-3 text-[15px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Register</Link>
                </>
              )}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function AuthenticatedActions({ profile, dashboard, onLogout }: { profile?: User; dashboard: string; onLogout: () => Promise<void> }) {
  return (
    <>
      <Button variant="secondary" asChild><Link href={dashboard}>Dashboard</Link></Button>
      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-semibold text-foreground marker:hidden">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{initials(profile?.name)}</span>
          <span>{profile?.name?.split(" ")[0]}</span>
        </summary>
        <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-border bg-card p-1.5 text-popover-foreground shadow-[var(--shadow-raised)]">
          <div className="px-3 py-2.5"><p className="text-sm font-semibold">{profile?.name}</p><p className="text-xs text-muted-foreground">{profile?.email}</p></div>
          <div className="my-1 h-px bg-border" />
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted" href={`${dashboard}/profile`}><UserIcon className="size-4" />Profile</Link>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-[#fee2e2]" onClick={onLogout}><LogOut className="size-4" />Log out</button>
        </div>
      </details>
    </>
  );
}
