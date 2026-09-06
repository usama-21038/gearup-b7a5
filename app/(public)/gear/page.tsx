import { Suspense } from "react";
import { GearBrowser } from "@/components/gear/gear-browser";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/lib/types";

export const metadata = { title: "Browse gear" };

async function getCategories() {
  try {
    return await apiFetch<Category[]>("/categories", { auth: false, next: { revalidate: 300 } });
  } catch {
    return [];
  }
}

export default async function GearBrowsePage() {
  const categories = await getCategories();

  return (
    <div className="container-gear py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Browse gear</h1>
        <p className="mt-1 text-muted-foreground">Filter by category, brand, price and availability.</p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Loading filters…</p>}>
        <GearBrowser categories={categories} />
      </Suspense>
    </div>
  );
}
