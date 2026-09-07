import { CustomerPayView } from "@/components/customer/customer-pages";

export default async function CustomerPayPage({ params }: { params: Promise<{ id: string }> }) {
  return <CustomerPayView id={(await params).id} />;
}
