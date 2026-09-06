import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <div className="container-gear flex h-16 items-center">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">{children}</div>
      </div>
      <p className="pb-8 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          ← Back to GearUp
        </Link>
      </p>
    </div>
  );
}
