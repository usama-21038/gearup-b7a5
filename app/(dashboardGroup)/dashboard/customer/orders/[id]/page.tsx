import { CustomerOrderDetailView } from "@/components/customer/customer-pages";

export default async function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <CustomerOrderDetailView id={(await params).id} />;
}
