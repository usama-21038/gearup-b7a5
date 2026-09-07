import { GearDetail } from "@/components/gear/gear-detail";
import { ErrorState, PageContainer } from "@/components/ui/gearup";
import { getGear, getGearById } from "@/service/gear/gearService";
import type { Gear } from "@/types/gear";
import { notFound } from "next/navigation";

async function loadGearDetail(id: string) {
  try {
    const response = await getGearById(id);
    if (!response.success || !response.data) return { kind: "not-found" as const };

    let relatedGear: Gear[] = [];
    try {
      const relatedResponse = await getGear({ category: response.data.category, limit: 4 });
      if (relatedResponse.success) relatedGear = (relatedResponse.data ?? []).filter((item) => String(item.id) !== id).slice(0, 3);
    } catch {
      relatedGear = [];
    }

    return { kind: "success" as const, gear: response.data, relatedGear };
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) return { kind: "not-found" as const };
    return { kind: "error" as const };
  }
}

export default async function GearDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadGearDetail(id);
  if (result.kind === "not-found") notFound();
  if (result.kind === "error") return <PageContainer className="py-16"><ErrorState title="We could not load this gear" description="The gear details are temporarily unavailable. Please try again shortly." /></PageContainer>;
  return <GearDetail gear={result.gear} relatedGear={result.relatedGear} />;
}
