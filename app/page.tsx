"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryApi, gearApi } from "@/lib/api";
import type { Category, GearItem } from "@/lib/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { GearCard, GearCardSkeleton } from "@/components/gear-card";
import { CategoryIcon } from "@/components/icons";

const TOPO_SVG = (
  <svg className="hero-topo" viewBox="0 0 1180 420" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-20 360 C 180 300, 260 380, 420 320 S 700 260, 860 330 S 1100 300, 1220 340" stroke="#DCE7FE" strokeWidth="2" fill="none" />
    <path d="M-20 300 C 180 250, 260 320, 420 270 S 700 210, 860 270 S 1100 250, 1220 280" stroke="#DCE7FE" strokeWidth="2" fill="none" />
    <path d="M-20 240 C 180 200, 260 260, 420 220 S 700 170, 860 220 S 1100 200, 1220 230" stroke="#E7EFFE" strokeWidth="2" fill="none" />
    <path d="M-20 180 C 180 150, 260 200, 420 170 S 700 130, 860 170 S 1100 150, 1220 175" stroke="#EEF4FF" strokeWidth="2" fill="none" />
  </svg>
);

export default function HomePage() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [gearRes, cats] = await Promise.all([
          gearApi.list({ limit: 24, available: true }),
          categoryApi.list(),
        ]);
        if (cancelled) return;
        setGear(gearRes.data);
        setCategories(cats);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Couldn't load gear right now."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryCounts = new Map<string, number>();
  for (const g of gear) {
    categoryCounts.set(g.category.name, (categoryCounts.get(g.category.name) || 0) + 1);
  }

  return (
    <div>
      <div className="hero">
        {TOPO_SVG}
        <div className="wrap">
          <div className="hero-inner">
            <span className="hero-eyebrow">Now live in 12 cities</span>
            <h1 className="text-display">Gear up. Get outside.</h1>
            <p className="text-body">
              Find and rent the sports and outdoor equipment you need, exactly when you need it — from bikes and
              tents to kayaks and rackets, ready near you.
            </p>
            <div className="hero-ctas">
              <Link href="/gear" className="btn btn-primary btn-lg">
                Explore gear
              </Link>
              <a href="#how-it-works" className="btn btn-outline btn-lg">
                How it works
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>2,400+</b>
                <span className="text-small">Gear items listed</span>
              </div>
              <div className="hero-stat">
                <b>180+</b>
                <span className="text-small">Verified providers</span>
              </div>
              <div className="hero-stat">
                <b>4.8</b>
                <span className="text-small">Average rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-tight">
        <div className="wrap">
          <h2 className="text-h2" style={{ marginBottom: 8 }}>
            Browse by category
          </h2>
          <p className="text-body" style={{ marginBottom: 24 }}>
            From bikes to basecamp essentials, find exactly what your next trip needs.
          </p>
          <div className="grid-4">
            {(categories.length ? categories : Array.from({ length: 4 }, () => null as Category | null)).map((c, i) =>
              c ? (
                <Link key={c.id} href={`/gear?category=${encodeURIComponent(c.name)}`} className="cat-card">
                  <div className="cat-icon">
                    <CategoryIcon category={c.name} size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                    <div className="text-small">{categoryCounts.get(c.name) || 0} items available</div>
                  </div>
                </Link>
              ) : (
                <div key={i} className="cat-card">
                  <div className="skel" style={{ width: 40, height: 40, borderRadius: 6 }} />
                  <div className="skel skel-line" style={{ width: "60%", margin: 0 }} />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="section-tight">
        <div className="wrap">
          <div className="flex-between" style={{ marginBottom: 22 }}>
            <div>
              <h2 className="text-h2" style={{ marginBottom: 8 }}>
                Featured gear
              </h2>
              <p className="text-body">Popular picks ready to rent right now.</p>
            </div>
            <Link href="/gear" className="btn btn-outline mobile-hide">
              View all gear
            </Link>
          </div>
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
          ) : gear.length === 0 ? (
            <div className="state-block card">
              <h3>No gear listed yet</h3>
              <p>Check back soon — providers are adding new equipment all the time.</p>
            </div>
          ) : (
            <div className="grid-3">
              {gear.slice(0, 6).map((g) => (
                <GearCard key={g.id} gear={g} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section" id="how-it-works">
        <div className="wrap">
          <h2 className="text-h2" style={{ marginBottom: 8 }}>
            How it works
          </h2>
          <p className="text-body" style={{ marginBottom: 32 }}>
            Three steps between you and your next adventure.
          </p>
          <div className="step-row">
            <div className="step">
              <div className="step-num">1</div>
              <h3 className="text-h3" style={{ marginBottom: 8 }}>
                Find your gear
              </h3>
              <p className="text-body">Search and filter listings by category, price, and availability near you.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3 className="text-h3" style={{ marginBottom: 8 }}>
                Choose your dates
              </h3>
              <p className="text-body">Pick a pickup and return date, and see the total cost before you commit.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3 className="text-h3" style={{ marginBottom: 8 }}>
                Rent & enjoy
              </h3>
              <p className="text-body">Pay securely online, pick up your gear, and get outside. Return it when you&apos;re done.</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="section"
        style={{
          background: "var(--color-text)",
          borderRadius: "var(--r-section)",
          maxWidth: 1180,
          margin: "0 auto 64px",
          padding: "64px 40px",
          textAlign: "center",
        }}
      >
        <h2 className="text-h2" style={{ color: "#fff", marginBottom: 10 }}>
          Ready for your next adventure?
        </h2>
              <p className="text-body">Gear is ready to rent near you, today.</p>
        <Link href="/gear" className="btn btn-primary btn-lg">
          Browse gear
        </Link>
      </div>
    </div>
  );
}
