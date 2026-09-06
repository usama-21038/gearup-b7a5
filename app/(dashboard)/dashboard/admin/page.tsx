import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <AdminDashboard initialTab={tab ?? "overview"} />;
}
