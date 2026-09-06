import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-gear flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Rent sports & outdoor gear instantly. Browse verified providers, book by the day, and get outside.
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <div className="space-y-2">
            <p className="font-medium">Explore</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link href="/gear" className="hover:text-foreground">Browse gear</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Become a provider</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Account</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground">Log in</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Create account</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="tag-stitch h-px w-full" />
      <p className="py-4 text-center text-xs text-muted-foreground">
        Built for the Apollo Level 2 Web Dev · Assignment 5 (GearUp).
      </p>
    </footer>
  );
}
