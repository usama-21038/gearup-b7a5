"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { providerApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import { useConfirm } from "@/lib/confirm-context";
import type { GearItem } from "@/lib/types";
import { fmtCurrency } from "@/lib/utils";
import { CategoryIcon, EditIcon, PlusIcon, TrashIcon, categoryTintClass } from "@/components/icons";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";

export default function ProviderGearPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const router = useRouter();
  const [gear, setGear] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    providerApi
      .gearList()
      .then(setGear)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  async function toggleStatus(item: GearItem) {
    setBusyId(item.id);
    try {
      const next = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const updated = await providerApi.updateGear(item.id, { status: next });
      setGear((prev) => prev.map((g) => (g.id === item.id ? updated : g)));
      toast.success(`${item.name} is now ${next.toLowerCase()}.`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update that listing."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(item: GearItem) {
    const ok = await confirm({
      title: `Delete "${item.name}"?`,
      body: "This permanently removes the listing. This can't be undone.",
      confirmLabel: "Delete",
      tone: "danger",
      icon: <TrashIcon size={18} />,
    });
    if (!ok) return;
    setBusyId(item.id);
    try {
      await providerApi.deleteGear(item.id);
      setGear((prev) => prev.filter((g) => g.id !== item.id));
      toast.success(`${item.name} was deleted.`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete that listing."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">My gear</h1>
          <p className="text-body">Manage your inventory, pricing, and availability.</p>
        </div>
        <Link href="/dashboard/provider/gear/new" className="btn btn-primary">
          <PlusIcon /> Add gear
        </Link>
      </div>
      <div className="card panel">
        {loading ? (
          <div className="skel skel-line" style={{ width: 200 }} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : gear.length === 0 ? (
          <EmptyState title="No gear listed yet" body="Add your first item to start renting it out." ctaLabel="Add gear" onCta={() => router.push("/dashboard/provider/gear/new")} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Gear</th>
                  <th>Category</th>
                  <th>Price/day</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {gear.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <div className="row-flex">
                        <div className={`mini-thumb ${categoryTintClass(g.category.name)}`}>
                          <CategoryIcon category={g.category.name} size={18} />
                        </div>
                        <div className="cell-primary">{g.name}</div>
                      </div>
                    </td>
                    <td>{g.category.name}</td>
                    <td className="cell-primary">{fmtCurrency(g.pricePerDay)}</td>
                    <td>
                      {g.availableQuantity} / {g.totalQuantity}
                    </td>
                    <td>
                      {busyId === g.id ? (
                        <Spinner dark />
                      ) : (
                        <button className={`badge badge-${g.status === "ACTIVE" ? "ACTIVE" : "SUSPENDED"}`} style={{ border: "none" }} onClick={() => toggleStatus(g)}>
                          <span className="badge-dot" />
                          {g.status === "ACTIVE" ? "Active" : "Inactive"}
                        </button>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <Link href={`/dashboard/provider/gear/${g.id}/edit`} className="btn btn-outline btn-sm">
                          <EditIcon /> Edit
                        </Link>
                        <button className="btn btn-destructive btn-sm" onClick={() => handleDelete(g)} disabled={busyId === g.id}>
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
