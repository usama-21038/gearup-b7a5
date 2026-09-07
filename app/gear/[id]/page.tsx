"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { gearApi, rentalApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { getErrorMessage } from "@/lib/get-error-message";
import type { GearItem } from "@/lib/types";
import { addDaysIso, fmtCurrency, initials, todayIso } from "@/lib/utils";
import { GearCard } from "@/components/gear-card";
import { AvailabilityBadge } from "@/components/badges";
import { ArrowLeftIcon, CategoryIcon, MapPinIcon, StarIcon, categoryTintClass } from "@/components/icons";
import { Spinner } from "@/components/ui";

type Tab = "description" | "specifications" | "provider" | "reviews";

export default function GearDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [gear, setGear] = useState<GearItem | null>(null);
  const [related, setRelated] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("description");
  const [galleryIdx, setGalleryIdx] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    gearApi
      .getById(params.id)
      .then((g) => {
        if (cancelled) return;
        setGear(g);
        gearApi
          .list({ category: g.category.name, limit: 4 })
          .then(({ data }) => setRelated(data.filter((x) => x.id !== g.id).slice(0, 3)))
          .catch(() => {});
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err, "Couldn't load this gear item.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const images = gear?.images || [];

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const pricePerDay = gear ? parseFloat(gear.pricePerDay) : 0;
  const subtotal = days * pricePerDay * quantity;

  async function handleRentNow() {
    if (!gear) return;
    if (!startDate || !endDate || days <= 0) {
      toast.error("Select a valid pickup and return date first.");
      return;
    }
    if (!user) {
      toast.error("Log in as a customer to rent gear.");
      router.push(`/auth/login?redirect=/gear/${gear.id}`);
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customer accounts can rent gear.");
      return;
    }
    setSubmitting(true);
    try {
      const order = await rentalApi.create({
        startDate,
        endDate,
        items: [{ gearItemId: gear.id, quantity }],
      });
      toast.success("Rental request placed — head to checkout to pay.");
      router.push(`/dashboard/customer/orders/${order.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't place that rental order."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="section-tight wrap" style={{ textAlign: "center", padding: "80px 0" }}>
        <Spinner dark />
      </div>
    );
  }

  if (error || !gear) {
    return (
      <div className="section-tight wrap">
        <div className="state-block card">
          <h3>Gear not found</h3>
          <p>{error || "This listing may have been removed."}</p>
          <Link href="/gear" className="btn btn-primary btn-sm">
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const tintClass = categoryTintClass(gear.category.name);
  const avgRating =
    gear.reviews && gear.reviews.length > 0
      ? (gear.reviews.reduce((s, r) => s + r.rating, 0) / gear.reviews.length).toFixed(1)
      : null;

  const tabs: Array<[Tab, string]> = [
    ["description", "Description"],
    ["specifications", "Specifications"],
    ["provider", "Provider"],
    ["reviews", "Reviews"],
  ];

  return (
    <div className="section-tight">
      <div className="wrap">
        <Link href="/gear" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, paddingLeft: 0 }}>
          <ArrowLeftIcon /> Back to browse
        </Link>
        <div className="detail-layout">
          <div>
            {images[galleryIdx] ? (
              <div className="gallery-main" style={{ position: "relative" }}>
                <Image src={images[galleryIdx]} alt={gear.name} fill sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: "cover" }} />
              </div>
            ) : (
              <div className={`gallery-main ${tintClass}`} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CategoryIcon category={gear.category.name} size={96} />
              </div>
            )}
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((src, i) => (
                  <div key={i} className={`gallery-thumb ${galleryIdx === i ? "active" : ""}`} style={{ position: "relative" }} onClick={() => setGalleryIdx(i)}>
                    <Image src={src} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}

            <div className="tab-row">
              {tabs.map(([key, label]) => (
                <button key={key} className={`tab-btn ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
                  {label}
                </button>
              ))}
            </div>

            {tab === "description" && <p className="text-body">{gear.description || "No description provided by the provider yet."}</p>}

            {tab === "specifications" && (
              <div className="spec-grid">
                <div className="spec-row">
                  <span>Brand</span>
                  <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{gear.brand || "—"}</span>
                </div>
                <div className="spec-row">
                  <span>Category</span>
                  <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{gear.category.name}</span>
                </div>
                <div className="spec-row">
                  <span>Total quantity</span>
                  <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{gear.totalQuantity}</span>
                </div>
                <div className="spec-row">
                  <span>Available now</span>
                  <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{gear.availableQuantity}</span>
                </div>
              </div>
            )}

            {tab === "provider" && (
              <div>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div className="provider-avatar">{initials(gear.provider.name)}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{gear.provider.name}</div>
                    <div className="text-small" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPinIcon /> {gear.provider.email}
                    </div>
                  </div>
                </div>
                {gear.provider.phone && (
                  <p className="text-body" style={{ marginTop: 16 }}>
                    Contact: {gear.provider.phone}
                  </p>
                )}
              </div>
            )}

            {tab === "reviews" && (
              <div>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                  <h3 className="text-h3">
                    {avgRating ?? "No ratings yet"} {gear.reviews && gear.reviews.length > 0 && `· ${gear.reviews.length} reviews`}
                  </h3>
                </div>
                {!gear.reviews || gear.reviews.length === 0 ? (
                  <p className="text-body">No reviews yet — be the first to rent and review this item.</p>
                ) : (
                  <div>
                    {gear.reviews.map((r) => (
                      <div key={r.id} className="review-item">
                        <div className="provider-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                          {initials(r.customer.name)}
                        </div>
                        <div>
                          <div className="flex-between" style={{ gap: 10 }}>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>{r.customer.name}</span>
                          </div>
                          <div className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                          {r.comment && <p className="text-small" style={{ marginTop: 6 }}>{r.comment}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {related.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <h3 className="text-h3" style={{ marginBottom: 16 }}>
                  You might also like
                </h3>
                <div className="grid-3">
                  {related.map((g) => (
                    <GearCard key={g.id} gear={g} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card rent-card">
              <span className="gear-cat">
                {gear.category.name} {gear.brand ? `· ${gear.brand}` : ""}
              </span>
              <h2 className="text-h3" style={{ margin: "4px 0 8px" }}>
                {gear.name}
              </h2>
              {gear.reviews && gear.reviews.length > 0 && (
                <div className="gear-rating" style={{ marginBottom: 10 }}>
                  <StarIcon />
                  <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{avgRating}</span>
                  <span>({gear.reviews.length} reviews)</span>
                </div>
              )}
              <div className="price-row">
                <b>{fmtCurrency(gear.pricePerDay)}</b>
                <span className="text-small">/ day</span>
              </div>
              <AvailabilityBadge availableQuantity={gear.availableQuantity} />
              <div className="provider-row">
                <div className="provider-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                  {initials(gear.provider.name)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{gear.provider.name}</div>
                  <div className="text-caption">{gear.provider.email}</div>
                </div>
              </div>

              {gear.availableQuantity > 0 ? (
                <>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label>Pickup date</label>
                    <input type="date" min={todayIso()} value={startDate} onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value >= endDate) setEndDate(""); }} />
                  </div>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label>Return date</label>
                    <input
                      type="date"
                      min={startDate ? addDaysIso(startDate, 1) : todayIso()}
                      value={endDate}
                      disabled={!startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  {gear.availableQuantity > 1 && (
                    <div className="field">
                      <label>Quantity</label>
                      <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))}>
                        {Array.from({ length: gear.availableQuantity }, (_, i) => i + 1).map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="price-breakdown">
                    <div className="row">
                      <span>
                        {fmtCurrency(gear.pricePerDay)} × {days || 0} day{days === 1 ? "" : "s"}
                        {quantity > 1 ? ` × ${quantity}` : ""}
                      </span>
                      <span>{fmtCurrency(subtotal)}</span>
                    </div>
                    <div className="row total">
                      <span>Total</span>
                      <span>{fmtCurrency(subtotal)}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} disabled={!days || submitting} onClick={handleRentNow}>
                    {submitting ? (
                      <>
                        <Spinner /> Placing request...
                      </>
                    ) : (
                      "Rent now"
                    )}
                  </button>
                  <p className="text-caption" style={{ textAlign: "center", marginTop: 10 }}>
                    You won&apos;t be charged yet
                  </p>
                </>
              ) : (
                <div className="state-block" style={{ padding: "24px 8px" }}>
                  <p style={{ fontSize: 13, margin: 0 }}>This item is fully booked right now. Check back soon or explore similar gear below.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
