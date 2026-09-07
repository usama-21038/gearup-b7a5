import { GearBrowser } from "@/components/gear/gear-browser";
import { ErrorState, PageContainer } from "@/components/ui/gearup";
import { getCategories, getGear } from "@/service/gear/gearService";

async function loadGearPage() {
  try {
    const [gearResponse, categoryResponse] = await Promise.all([getGear(), getCategories()]);
    if (!gearResponse.success || !categoryResponse.success) return null;
    const gear = gearResponse.data ?? [];
    const categories = categoryResponse.data?.length ? categoryResponse.data : [...new Set(gear.map((item) => item.category))];
    return { gear, categories };
  } catch {
    return null;
  }
}

export default async function GearPage() {
  const result = await loadGearPage();
  return result ? <GearBrowser gear={result.gear} categories={result.categories} /> : <GearError />;
}

function GearError() {
  return <PageContainer className="py-16"><ErrorState title="We could not load the gear catalogue" description="The gear catalogue is temporarily unavailable. Please try again shortly." /></PageContainer>;
}
