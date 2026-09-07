import type { Gear } from "@/types/gear";

export type GearSort = "rec" | "low" | "high" | "rating";
export type GearAvailability = "any" | "available";

export type GearBrowseFilters = {
  search: string;
  category: string;
  priceMax: number;
  availability: GearAvailability;
  sort: GearSort;
};

export const defaultGearBrowseFilters: GearBrowseFilters = {
  search: "",
  category: "All",
  priceMax: 50,
  availability: "any",
  sort: "rec",
};

export function parseGearBrowseFilters(params: URLSearchParams | Record<string, string | string[] | undefined>): GearBrowseFilters {
  const getValue = (key: string) => params instanceof URLSearchParams ? params.get(key) ?? undefined : Array.isArray(params[key]) ? params[key][0] : params[key];
  const parsedPrice = Number(getValue("maxPrice"));
  const sort = getValue("sort");
  const availability = getValue("availability");

  return {
    search: getValue("search")?.trim() ?? "",
    category: getValue("category") || defaultGearBrowseFilters.category,
    priceMax: Number.isFinite(parsedPrice) && parsedPrice >= 5 ? Math.min(parsedPrice, 50) : defaultGearBrowseFilters.priceMax,
    availability: availability === "available" ? availability : defaultGearBrowseFilters.availability,
    sort: sort === "low" || sort === "high" || sort === "rating" ? sort : defaultGearBrowseFilters.sort,
  };
}

export function filterAndSortGear(gear: Gear[], filters: GearBrowseFilters) {
  const search = filters.search.toLowerCase();
  const filtered = gear.filter((item) => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search) || item.brand?.toLowerCase().includes(search);
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesPrice = item.pricePerDay <= filters.priceMax;
    const matchesAvailability = filters.availability === "any" || (item.available && item.stock > 0);
    return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
  });

  if (filters.sort === "low") return filtered.toSorted((a, b) => a.pricePerDay - b.pricePerDay);
  if (filters.sort === "high") return filtered.toSorted((a, b) => b.pricePerDay - a.pricePerDay);
  if (filters.sort === "rating") return filtered.toSorted((a, b) => (b.provider?.rating ?? 0) - (a.provider?.rating ?? 0));
  return filtered;
}

export function buildGearBrowseQuery(filters: GearBrowseFilters) {
  const query = new URLSearchParams();
  if (filters.search) query.set("search", filters.search);
  if (filters.category !== defaultGearBrowseFilters.category) query.set("category", filters.category);
  if (filters.priceMax !== defaultGearBrowseFilters.priceMax) query.set("maxPrice", String(filters.priceMax));
  if (filters.availability !== defaultGearBrowseFilters.availability) query.set("availability", filters.availability);
  if (filters.sort !== defaultGearBrowseFilters.sort) query.set("sort", filters.sort);
  return query;
}
