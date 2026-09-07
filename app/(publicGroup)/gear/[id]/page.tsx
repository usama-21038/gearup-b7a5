import { RoutePlaceholder } from "@/components/shared/route-placeholder";

type GearDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GearDetailsPage({ params }: GearDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <RoutePlaceholder title={`Gear details: ${id}`} description="Gear detail foundation." />
    </div>
  );
}