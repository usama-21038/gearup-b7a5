"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categoryApi, providerApi, ApiError, type GearInput } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import type { Category, GearItem } from "@/lib/types";
import { FieldError, Spinner } from "./ui";
import { PlusIcon, TrashIcon } from "./icons";

export function GearForm({ existing }: { existing?: GearItem }) {
  const router = useRouter();
  const toast = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(existing?.name || "");
  const [brand, setBrand] = useState(existing?.brand || "");
  const [categoryId, setCategoryId] = useState(existing?.categoryId || "");
  const [pricePerDay, setPricePerDay] = useState(existing?.pricePerDay || "");
  const [totalQuantity, setTotalQuantity] = useState(existing ? String(existing.totalQuantity) : "1");
  const [description, setDescription] = useState(existing?.description || "");
  const [images, setImages] = useState<string[]>(existing?.images && existing.images.length > 0 ? existing.images : [""]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    categoryApi
      .list()
      .then((cats) => {
        setCategories(cats);
        if (!categoryId && cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imagesError = Object.entries(fieldErrors).find(([k]) => k.startsWith("images"))?.[1];

  function updateImage(i: number, value: string) {
    setImages((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }
  function addImageRow() {
    setImages((prev) => [...prev, ""]);
  }
  function removeImageRow(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    const payload: GearInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      brand: brand.trim() || undefined,
      images: images.map((i) => i.trim()).filter(Boolean),
      pricePerDay: parseFloat(String(pricePerDay)),
      totalQuantity: parseInt(totalQuantity, 10),
      categoryId,
    };

    try {
      if (existing) {
        await providerApi.updateGear(existing.id, payload);
        toast.success(`${payload.name} was updated.`);
      } else {
        await providerApi.createGear(payload);
        toast.success(`${payload.name} was added to your inventory.`);
      }
      router.push("/dashboard/provider/gear");
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors());
      toast.error(getErrorMessage(err, "Couldn't save that gear item."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card panel" style={{ maxWidth: 640 }}>
      <div className={`field ${fieldErrors.name ? "has-error" : ""}`}>
        <label>
          Gear name <span className="req">*</span>
        </label>
        <input type="text" placeholder="e.g. Trek Marlin 7 Mountain Bike" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
        <FieldError message={fieldErrors.name} />
      </div>

      <div className="grid-2">
        <div className={`field ${fieldErrors.categoryId ? "has-error" : ""}`}>
          <label>
            Category <span className="req">*</span>
          </label>
          <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.length === 0 && <option value="">No categories yet</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.categoryId} />
          {categories.length === 0 && <div className="field-help">Ask an admin to create a category before listing gear.</div>}
        </div>
        <div className={`field ${fieldErrors.brand ? "has-error" : ""}`}>
          <label>Brand</label>
          <input type="text" placeholder="e.g. Trek" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <FieldError message={fieldErrors.brand} />
        </div>
      </div>

      <div className="grid-2">
        <div className={`field ${fieldErrors.pricePerDay ? "has-error" : ""}`}>
          <label>
            Price per day (USD) <span className="req">*</span>
          </label>
          <input type="number" min={0.01} step={0.01} required placeholder="25.00" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />
          <FieldError message={fieldErrors.pricePerDay} />
        </div>
        <div className={`field ${fieldErrors.totalQuantity ? "has-error" : ""}`}>
          <label>
            Total quantity <span className="req">*</span>
          </label>
          <input type="number" min={1} step={1} required value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} />
          <FieldError message={fieldErrors.totalQuantity} />
          {existing && <div className="field-help">Available stock adjusts automatically when you change this.</div>}
        </div>
      </div>

      <div className={`field ${fieldErrors.description ? "has-error" : ""}`}>
        <label>Description</label>
        <textarea placeholder="Condition, included accessories, size, pickup instructions..." value={description} onChange={(e) => setDescription(e.target.value)} />
        <FieldError message={fieldErrors.description} />
      </div>

      <div className={`field ${imagesError ? "has-error" : ""}`}>
        <label>Image URLs</label>
        {images.map((img, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input type="text" placeholder="https://images.example.com/gear.jpg" value={img} onChange={(e) => updateImage(i, e.target.value)} />
            {images.length > 1 && (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => removeImageRow(i)} aria-label="Remove image">
                <TrashIcon />
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addImageRow}>
          <PlusIcon size={14} /> Add another image
        </button>
        {imagesError ? <FieldError message={imagesError} /> : <div className="field-help">Paste direct links to hosted photos (the API stores URLs, not file uploads).</div>}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button type="button" className="btn btn-outline" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting || categories.length === 0}>
          {submitting ? (
            <>
              <Spinner /> Saving...
            </>
          ) : existing ? (
            "Save changes"
          ) : (
            "Add gear"
          )}
        </button>
      </div>
    </form>
  );
}
