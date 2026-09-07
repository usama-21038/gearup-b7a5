import { Mountain } from "lucide-react";
import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";
import { PageContainer } from "@/components/ui/gearup";

export default function RegisterPage() {
  return <main className="flex min-h-[calc(100vh-136px)] items-center py-12 sm:py-16"><PageContainer><div className="mx-auto w-full max-w-[460px] rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-9"><div className="mb-7 text-center"><span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Mountain className="size-5" /></span><h1 className="gearup-h2">Create your account</h1><p className="gearup-small mt-1.5">Start renting or listing gear in minutes.</p></div><RegisterForm /><p className="mt-5 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link></p></div></PageContainer></main>;
}
