import { Navbar } from "@/components/shared/navbar";
import type { CurrentUserResponse } from "@/types/user";

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: CurrentUserResponse;
}) {
  return (
    <>
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}