"use client";

import { useEffect, useState } from "react";
import { rentalApi, reviewApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import type { RentalOrder } from "@/lib/types";
import { fmtDateShort } from "@/lib/utils";
import { CategoryIcon, CheckCircleIcon, ReviewIcon, categoryTintClass } from "@/components/icons";
import { EmptyState, ErrorState } from "@/components/ui";
import { ReviewModal } from "@/components/review-modal";

interface ReviewCandidate {
  orderId: string;
  gearItemId: string;
  gearName: string;
  category: string;
  returnedOn: string;
}

export default function CustomerReviewsPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const load = () => {
    setLoading(true);
    rentalApi
      .list()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const candidates: ReviewCandidate[] = orders
    .filter((o) => o.status === "RETURNED")
    .flatMap((o) =>
      o.items.map((item) => ({
        orderId: o.id,
        gearItemId: item.gearItemId,
        gearName: item.gearItem.name,
        category: item.gearItem.category.name,
        returnedOn: o.updatedAt,
      }))
    );

  if (loading) return <div className="skel skel-line" style={{ width: 200 }} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Reviews</h1>
          <p className="text-body">Share feedback on gear you&apos;ve returned.</p>
        </div>
      </div>
      <div className="card panel">
        {candidates.length === 0 ? (
          <EmptyState icon={<ReviewIcon size={20} />} title="Nothing to review yet" body="Once you return a rental, you'll be able to leave a review here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {candidates.map((c) => {
              const key = `${c.orderId}:${c.gearItemId}`;
              const done = reviewedIds.has(key);
              return (
                <div key={key} className="review-item" style={{ alignItems: "center" }}>
                  <div className={`mini-thumb ${categoryTintClass(c.category)}`} style={{ width: 44, height: 44 }}>
                    <CategoryIcon category={c.category} size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{c.gearName}</div>
                    <div className="text-small">Returned {fmtDateShort(c.returnedOn)}</div>
                  </div>
                  {done ? (
                    <span className="text-small" style={{ color: "var(--color-success-text)", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircleIcon size={14} /> Reviewed
                    </span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => setReviewingId(key)}>
                      Leave review
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reviewingId && (
        <ReviewModal
          onClose={() => setReviewingId(null)}
          onSubmit={async (rating, comment) => {
            const [, gearItemId] = reviewingId.split(":");
            try {
              await reviewApi.create({ gearItemId, rating, comment: comment || undefined });
              setReviewedIds((prev) => new Set(prev).add(reviewingId));
              toast.success("Review submitted — thanks for the feedback!");
            } catch (err) {
              toast.error(getErrorMessage(err, "Couldn't submit that review."));
            } finally {
              setReviewingId(null);
            }
          }}
        />
      )}
    </div>
  );
}
