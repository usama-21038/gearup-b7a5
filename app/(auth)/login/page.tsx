import { LoginForm } from "../_components/login-form";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-muted-foreground">Log in to manage your rentals, gear, or platform.</p>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
