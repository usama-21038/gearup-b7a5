"use client";

import { EmptyState, PageContainer, ResponsiveGrid } from "@/components/ui/gearup";
import { Button } from "@/components/ui/button";
import type { Gear } from "@/types/gear";
import { buildGearBrowseQuery, defaultGearBrowseFilters, filterAndSortGear, parseGearBrowseFilters, type GearBrowseFilters, type GearSort } from "@/lib/gear-filters";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GearCard } from "@/components/gear/gear-card";

export function GearBrowser({ gear, categories }: { gear: Gear[]; categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseGearBrowseFilters(new URLSearchParams(searchParams.toString()));
  const results = useMemo(() => filterAndSortGear(gear, filters), [gear, filters]);
  const [searchText, setSearchText] = useState(filters.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateFilters = (updates: Partial<GearBrowseFilters>) => {
    const nextFilters = { ...filters, ...updates };
    const query = buildGearBrowseQuery(nextFilters).toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    setMobileFiltersOpen(false);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFilters({ search: searchText });
  };

  const clearFilters = () => {
    setSearchText("");
    updateFilters(defaultGearBrowseFilters);
  };

  return (
    <div className="py-10 sm:py-16">
      <PageContainer>
        <div className="mb-6">
          <h1 className="gearup-h1">Browse gear</h1>
          <p className="gearup-body mt-1.5">Sports and outdoor equipment, ready to rent near you.</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:sticky lg:top-[88px] lg:block"><FilterControls categories={categories} filters={filters} onChange={updateFilters} onClear={clearFilters} /></aside>
          <section>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <form onSubmit={submitSearch} className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
                <input value={searchText} onChange={(event) => setSearchText(event.target.value)} className="h-11 w-full rounded-md border border-input bg-card py-2 pl-10 pr-3.5 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-secondary" placeholder="Search gear or brand..." aria-label="Search gear or brand" />
              </form>
              <Button variant="outline" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}><SlidersHorizontal />Filters</Button>
              <label className="relative flex shrink-0 items-center">
                <span className="sr-only">Sort gear</span>
                <select value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value as GearSort })} className="h-11 appearance-none rounded-md border border-input bg-card py-2 pl-3.5 pr-9 text-sm text-foreground outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary">
                  <option value="rec">Sort: Recommended</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="rating">Highest rated</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
              </label>
            </div>

            <ActiveFilterChips filters={filters} onChange={updateFilters} onClear={clearFilters} />
            <p className="mb-4 text-sm text-muted-foreground">{results.length} item{results.length === 1 ? "" : "s"} found</p>
            {results.length > 0 ? <ResponsiveGrid columns={3}>{results.map((item) => <GearCard gear={item} key={item.id} />)}</ResponsiveGrid> : <div className="rounded-xl border border-border bg-card"><EmptyState title="No gear found" description="Try a different category, a higher price range, or clear your filters to see everything available." action={<Button size="sm" onClick={clearFilters}>Clear filters</Button>} /></div>}
          </section>
        </div>
      </PageContainer>

      {mobileFiltersOpen ? <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Gear filters"><button className="absolute inset-0 h-full w-full bg-slate-900/40" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} /><aside className="absolute right-0 top-0 h-full w-[min(88vw,360px)] overflow-y-auto bg-card p-5 shadow-[var(--shadow-modal)]"><div className="mb-6 flex items-center justify-between"><h2 className="gearup-h3">Filters</h2><Button variant="ghost" size="icon-sm" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)}><X /></Button></div><FilterControls categories={categories} filters={filters} onChange={updateFilters} onClear={clearFilters} /></aside></div> : null}
    </div>
  );
}

function FilterControls({ categories, filters, onChange, onClear }: { categories: string[]; filters: GearBrowseFilters; onChange: (updates: Partial<GearBrowseFilters>) => void; onClear: () => void }) {
  return <div>
    <FilterGroup title="Category"><div className="flex flex-wrap gap-2">{["All", ...categories.filter((category) => category !== "All")].map((category) => <button key={category} onClick={() => onChange({ category })} className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${filters.category === category ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground hover:bg-muted"}`}>{category}</button>)}</div></FilterGroup>
    <FilterGroup title="Price per day"><input type="range" min="5" max="50" step="1" value={filters.priceMax} onChange={(event) => onChange({ priceMax: Number(event.target.value) })} className="w-full accent-primary" aria-label="Maximum price per day" /><div className="mt-2 flex justify-between text-[13px] text-muted-foreground"><span>$5</span><span>Up to ${filters.priceMax}</span></div></FilterGroup>
    <FilterGroup title="Availability"><div className="flex flex-wrap gap-2"><FilterPill active={filters.availability === "any"} onClick={() => onChange({ availability: "any" })}>Any</FilterPill><FilterPill active={filters.availability === "available"} onClick={() => onChange({ availability: "available" })}>Available now</FilterPill></div></FilterGroup>
    <Button variant="outline" size="sm" className="w-full" onClick={onClear}>Clear all filters</Button>
  </div>;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mb-6"><h2 className="mb-3 text-[13px] font-bold">{title}</h2>{children}</div>;
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground hover:bg-muted"}`}>{children}</button>;
}

function ActiveFilterChips({ filters, onChange, onClear }: { filters: GearBrowseFilters; onChange: (updates: Partial<GearBrowseFilters>) => void; onClear: () => void }) {
  const chips: Array<{ label: string; clear: () => void }> = [];
  if (filters.category !== "All") chips.push({ label: filters.category, clear: () => onChange({ category: "All" }) });
  if (filters.search) chips.push({ label: `"${filters.search}"`, clear: () => onChange({ search: "" }) });
  if (filters.availability === "available") chips.push({ label: "Available now", clear: () => onChange({ availability: "any" }) });
  if (filters.priceMax < 50) chips.push({ label: `Under $${filters.priceMax}/day`, clear: () => onChange({ priceMax: 50 }) });
  if (chips.length === 0) return null;
  return <div className="mb-4 flex flex-wrap gap-2">{chips.map((chip) => <span key={chip.label} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{chip.label}<button onClick={chip.clear} aria-label={`Remove ${chip.label} filter`}><X className="size-3.5" /></button></span>)}<button className="text-xs font-semibold text-primary hover:underline" onClick={onClear}>Clear all</button></div>;
}
