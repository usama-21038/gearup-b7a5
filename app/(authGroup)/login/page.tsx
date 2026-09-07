import LoginForm from "../_components/LoginForm";
import { PageContainer } from "@/components/ui/gearup";
import { Mountain } from "lucide-react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const params = await searchParams;

  return <main className="flex min-h-[calc(100vh-136px)] items-center py-12 sm:py-16"><PageContainer><div className="mx-auto w-full max-w-[420px] rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-9"><div className="mb-7 text-center"><span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Mountain className="size-5" /></span><h1 className="gearup-h2">Welcome back</h1><p className="gearup-small mt-1.5">Log in to manage your rentals.</p></div><LoginForm registered={params.registered === "1"} /></div></PageContainer></main>;
}
