import { RegisterForm } from "../_components/register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold">Create your account</h1>
      <p className="mb-6 text-sm text-muted-foreground">Rent gear as a customer, or list your own as a provider.</p>
      <RegisterForm />
    </div>
  );
}
