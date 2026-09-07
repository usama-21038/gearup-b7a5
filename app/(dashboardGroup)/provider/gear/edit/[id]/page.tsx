import { ProviderGearFormView } from "@/components/provider/provider-pages";

export default async function EditProviderGearPage({ params }: { params: Promise<{ id: string }> }) { return <ProviderGearFormView id={(await params).id} />; }