"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { GearCard } from "./gear-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientApiFetchWithMeta } from "@/lib/client-api";
import type { Category, GearItem } from "@/lib/types";

interface Filters {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  available: boolean;
  page: number;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  available: false,
  page: 1,
};

function filtersFromParams(params: URLSearchParams): Filters {
  return {
    search: params.get("search") || "",
    category: params.get("category") || "",
    brand: params.get("brand") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    available: params.get("available") === "true",
    page: Number(params.get("page")) || 1,
  };
}

function buildQuery(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.available) params.set("available", "true");
  if (filters.page > 1) params.set("page", String(filters.page));
  params.set("limit", "12");
  return params.toString();
}

export function GearBrowser({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = React.useState<Filters>(() => filtersFromParams(searchParams));
  const [searchDraft, setSearchDraft] = React.useState(filters.search);

  // Debounce the free-text search box so we don't refetch on every keystroke.
  React.useEffect(() => {
    const id = setTimeout(() => {
      setFilters((f) => (f.search === searchDraft ? f : { ...f, search: searchDraft, page: 1 }));
    }, 350);
    return () => clearTimeout(id);
  }, [searchDraft]);

  // Keep the URL in sync so filtered views are shareable / bookmarkable.
  React.useEffect(() => {
    const query = buildQuery(filters);
    router.replace(`/gear${query ? `?${query}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const query = useQuery({
    queryKey: ["gear", filters],
    queryFn: () => clientApiFetchWithMeta<GearItem[]>(`/gear?${buildQuery(filters)}`),
  });

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value, page: key === "page" ? (value as number) : 1 }));
  }

  function clearAll() {
    setFilters(DEFAULT_FILTERS);
    setSearchDraft("");
  }

  const hasActiveFilters =
    filters.search || filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.available;

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </h2>
          {hasActiveFilters && (
            <button onClick={clearAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Tent, kayak, bike..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={filters.category || "all"} onValueChange={(v) => update("category", v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            placeholder="e.g. Coleman"
            value={filters.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Price per day</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => update("minPrice", e.target.value)}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-primary"
            checked={filters.available}
            onChange={(e) => update("available", e.target.checked)}
          />
          Available right now only
        </label>
      </aside>

      <div>
        {query.isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : query.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
            Couldn&apos;t load gear right now. Please try again in a moment.
          </div>
        ) : query.data && query.data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {query.data.data.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
            {query.data.meta && query.data.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page <= 1}
                  onClick={() => update("page", filters.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {query.data.meta.page} of {query.data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page >= query.data.meta.totalPages}
                  onClick={() => update("page", filters.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No gear matches these filters. Try widening your search.
          </div>
        )}
      </div>
    </div>
  );
}
