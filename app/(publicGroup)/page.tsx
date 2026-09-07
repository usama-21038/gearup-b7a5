import { Button } from "@/components/ui/button";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";
import Link from "next/link";

export default async function HomePage() {


  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <RoutePlaceholder
        title="Rent sports and outdoor gear instantly"
        description="GearUp public home foundation. Featured gear and discovery sections will be added next."
      />
      <Button className="mt-6" asChild>
        <Link href="/gear">Browse gear</Link>
      </Button>
    </div>
  );
}
