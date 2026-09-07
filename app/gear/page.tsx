"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categoryApi, gearApi } from "@/lib/api";
import type { Category, GearItem } from "@/lib/types";
import { fmtCurrency } from "@/lib/utils";
import { getErrorMessage } from "@/lib/get-error-message";
import { GearCard, GearCardSkeleton } from "@/components/gear-card";
import { Pagination } from "@/components/ui";
import { FilterIcon, SearchIcon, XIcon } from "@/components/icons";

const MAX_PRICE_CEILING = 200;
type SortOption = "recommended" | "price-low" | "price-high";

function BrowseGearInner() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [gear, setGear] = useState<GearItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "All");
  const [brand, setBrand] = useState<string>("All");
  const [priceMax, setPriceMax] = useState(MAX_PRICE_CEILING);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [page, setPage] = useState(1);

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {});
  }, []);

  // Debounced fetch whenever filters change.
  useEffect(() => {
    setLoading(true);
    setError(null);
    const handle = setTimeout(() => {
      gearApi
        .list({
          search: search || undefined,
          category: category !== "All" ? category : undefined,
          brand: brand !== "All" ? brand : undefined,
          maxPrice: priceMax < MAX_PRICE_CEILING ? priceMax : undefined,
          available: availableOnly || undefined,
          page,
          limit: 12,
        })
        .then(({ data, meta }) => {
          const sorted = [...data];
          if (sort === "price-low") sorted.sort((a, b) => parseFloat(a.pricePerDay) - parseFloat(b.pricePerDay));
          if (sort === "price-high") sorted.sort((a, b) => parseFloat(b.pricePerDay) - parseFloat(a.pricePerDay));
          setGear(sorted);
          setTotalPages(meta?.totalPages || 1);
        })
        .catch((err) => setError(getErrorMessage(err, "Couldn't load gear right now.")))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [search, category, brand, priceMax, availableOnly, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, brand, priceMax, availableOnly]);

  const brands = useMemo(() => Array.from(new Set(gear.map((g) => g.brand).filter(Boolean))) as string[], [gear]);

  const activeChips: Array<{ label: string; clear: () => void }> = [];
  if (category !== "All") activeChips.push({ label: category, clear: () => setCategory("All") });
  if (search) activeChips.push({ label: `"${search}"`, clear: () => setSearch("") });
  if (availableOnly) activeChips.push({ label: "Available now", clear: () => setAvailableOnly(false) });
  if (priceMax < MAX_PRICE_CEILING) activeChips.push({ label: `Under ${fmtCurrency(priceMax)}/day`, clear: () => setPriceMax(MAX_PRICE_CEILING) });

  function clearAll() {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceMax(MAX_PRICE_CEILING);
    setAvailableOnly(false);
  }

  const sidebar = (
    <div className="filter-panel">
      <div className="filter-group">
        <h4>Category</h4>
        <div className="chip-list">
          <span className={`chip ${category === "All" ? "active" : ""}`} onClick={() => setCategory("All")}>
            All
          </span>
          {categories.map((c) => (
            <span key={c.id} className={`chip ${category === c.name ? "active" : ""}`} onClick={() => setCategory(c.name)}>
              {c.name}
            </span>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <h4>Price per day</h4>
        <input
          type="range"
          min={5}
          max={MAX_PRICE_CEILING}
          step={5}
          value={priceMax}
          style={{ width: "100%" }}
          onChange={(e) => setPriceMax(parseInt(e.target.value, 10))}
        />
        <div className="range-val">
          <span>$5</span>
          <span>Up to {fmtCurrency(priceMax)}</span>
        </div>
      </div>
      {brands.length > 0 && (
        <div className="filter-group">
          <h4>Brand</h4>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="All">All brands</option>
            {brands.sort().map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="filter-group">
        <h4>Availability</h4>
        <div className="chip-list">
          <span className={`chip ${!availableOnly ? "active" : ""}`} onClick={() => setAvailableOnly(false)}>
            Any
          </span>
          <span className={`chip ${availableOnly ? "active" : ""}`} onClick={() => setAvailableOnly(true)}>
            Available now
          </span>
        </div>
      </div>
      <button className="btn btn-outline btn-block btn-sm" onClick={clearAll}>
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="section-tight">
      <div className="wrap">
        <div style={{ marginBottom: 22 }}>
          <h1 className="text-h1">Browse gear</h1>
          <p className="text-body">Sports and outdoor equipment, ready to rent near you.</p>
        </div>
        <div className="browse-layout">
          <div className="mobile-hide">{sidebar}</div>
          <div>
            <div className="browse-toolbar">
              <div className="search-input-wrap">
                <SearchIcon />
                <input type="text" placeholder="Search gear or brand..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-outline mobile-filter-btn" onClick={() => setMobileFiltersOpen(true)}>
                <FilterIcon /> Filters
              </button>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--r-input)", padding: "11px 14px" }}>
                <option value="recommended">Sort: Recommended</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
              </select>
            </div>
            {activeChips.length > 0 && (
              <div className="chip-list" style={{ marginBottom: 16 }}>
                {activeChips.map((c, i) => (
                  <span key={i} className="filter-chip-x">
                    {c.label}
                    <span style={{ cursor: "pointer" }} onClick={c.clear}>
                      <XIcon size={12} />
                    </span>
                  </span>
                ))}
              </div>
            )}

            {error ? (
              <div className="state-block card">
                <p>{error}</p>
              </div>
            ) : loading ? (
              <div className="grid-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <GearCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <p className="text-small" style={{ marginBottom: 16 }}>
                  {gear.length} item{gear.length !== 1 ? "s" : ""} found
                </p>
                {gear.length === 0 ? (
                  <div className="state-block card">
                    <div className="state-icon">
                      <SearchIcon />
                    </div>
                    <h3>No gear found</h3>
                    <p>Try a different category, a higher price range, or clear your filters to see everything we have.</p>
                    <button className="btn btn-primary btn-sm" onClick={clearAll}>
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid-3">
                    {gear.map((g) => (
                      <GearCard key={g.id} gear={g} />
                    ))}
                  </div>
                )}
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setMobileFiltersOpen(false)}>
          <div className="modal-box">
            <div className="flex-between" style={{ marginBottom: 14 }}>
              <h3 className="text-h3">Filters</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setMobileFiltersOpen(false)}>
                <XIcon />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrowseGearPage() {
  return (
    <Suspense fallback={<div className="section-tight wrap">Loading…</div>}>
      <BrowseGearInner />
    </Suspense>
  );
}
