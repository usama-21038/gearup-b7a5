import { ProviderDashboard } from "@/components/provider/provider-dashboard";

export const metadata = { title: "Provider dashboard" };

export default async function ProviderDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <ProviderDashboard initialTab={tab ?? "overview"} />;
}
