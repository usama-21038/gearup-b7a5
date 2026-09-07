import { Mountain } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Browse gear", href: "/gear" },
      { label: "Become a provider", href: "/register" },
      { label: "How it works", href: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/" },
      { label: "Cancellations", href: "/" },
      { label: "Contact us", href: "mailto:support@gearup.io" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Trust & safety", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-card">
      <div className="gearup-container py-12 sm:py-[52px]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-3 flex items-center gap-2 text-[19px] font-extrabold tracking-[-0.02em]">
              <span className="flex size-[30px] items-center justify-center rounded-lg bg-primary text-primary-foreground"><Mountain className="size-4" /></span>
              GearUp
            </Link>
            <p className="gearup-small max-w-[220px]">Rent sports and outdoor gear instantly from local providers you can trust.</p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3.5 text-[13px] font-bold text-foreground">{column.title}</h2>
              <nav className="flex flex-col items-start gap-2.5" aria-label={`${column.title} links`}>
                {column.links.map((link) => (
                  <Link key={link.label} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.label}</Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="mt-9 flex flex-col gap-3 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 GearUp, Inc. All rights reserved.</span>
          <span>Instagram · TikTok · X</span>
        </div>
      </div>
    </footer>
  );
}
