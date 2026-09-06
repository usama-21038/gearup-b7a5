import Link from "next/link";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { getSession, dashboardPathForRole } from "@/lib/session";
import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Browse gear" },
];

export async function Navbar() {
  const session = await getSession();
  let user: User | null = null;

  if (session) {
    try {
      user = await apiFetch<User>("/auth/me", { next: { revalidate: 60 } });
    } catch {
      user = null;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-gear flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu name={user.name} email={user.email} role={user.role} dashboardPath={dashboardPathForRole(user.role)} />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="accent" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
