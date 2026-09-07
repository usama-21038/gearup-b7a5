"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { gearApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import type { GearItem } from "@/lib/types";
import { GearForm } from "@/components/gear-form";
import { ErrorState, Spinner } from "@/components/ui";

export default function EditGearPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [gear, setGear] = useState<GearItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gearApi
      .getById(params.id)
      .then(setGear)
      .catch((err) => setError(getErrorMessage(err, "Couldn't load this listing.")))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spinner dark />
      </div>
    );
  }
  if (error || !gear) return <ErrorState message={error || "Listing not found."} />;
  if (user && gear.providerId !== user.id) return <ErrorState message="You don't have permission to edit this listing." />;

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Edit gear</h1>
          <p className="text-body">Update details for {gear.name}.</p>
        </div>
      </div>
      <GearForm existing={gear} />
    </div>
  );
}
