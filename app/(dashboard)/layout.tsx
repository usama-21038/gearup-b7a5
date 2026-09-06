import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { apiFetch } from "@/lib/api";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { customerSidebar, providerSidebar, adminSidebar } from "@/components/dashboard/sidebar-config";
import type { User } from "@/lib/types";

const SIDEBARS = {
  CUSTOMER: customerSidebar,
  PROVIDER: providerSidebar,
  ADMIN: adminSidebar,
} as const;

const ROLE_LABEL = {
  CUSTOMER: "Customer",
  PROVIDER: "Provider",
  ADMIN: "Admin",
} as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: proxy.ts already redirects logged-out visitors away from
  // /dashboard for a fast UX-level bounce, but it only decodes the JWT (see
  // lib/session.ts). Every real dashboard page re-checks here with a live
  // call to the backend (`/auth/me`), which verifies the token's signature,
  // expiry, and that the account isn't suspended - so a forged/stale cookie
  // can never render real data even if it slipped past the proxy.
  const session = await getSession();
  if (!session) redirect("/login");

  let user: User;
  try {
    user = await apiFetch<User>("/auth/me");
  } catch {
    redirect("/login");
  }

  const items = SIDEBARS[user.role];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-secondary/30 p-4 lg:block">
        <DashboardSidebar items={items} roleLabel={ROLE_LABEL[user.role]} />
      </aside>
      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.name}</span>
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
        </header>
        <main className="container-gear py-8">{children}</main>
      </div>
    </div>
  );
}
