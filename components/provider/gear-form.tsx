"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/gearup";
import { createGear, updateGear } from "@/service/gear/gearService";
import type { Gear, GearPayload } from "@/types/gear";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function GearForm({ gear, categories }: { gear?: Gear; categories: string[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState(gear?.available ?? true);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true); setError("");
    const values = new FormData(event.currentTarget);
    const payload: GearPayload = { name: String(values.get("name") || "").trim(), category: String(values.get("category") || "").trim(), brand: String(values.get("brand") || "").trim() || undefined, description: String(values.get("description") || "").trim() || undefined, pricePerDay: Number(values.get("pricePerDay")), stock: Number(values.get("stock")), imageUrl: String(values.get("imageUrl") || "").trim() || undefined, available };
    try {
      const response = gear ? await updateGear(gear.id, payload) : await createGear(payload);
      if (!response.success) throw new Error(response.message || "Gear could not be saved.");
      toast.success(gear ? "Gear updated." : "Gear added to inventory.");
      router.push("/dashboard/provider/gear");
      router.refresh();
    } catch (saveError) { const message = saveError instanceof Error ? saveError.message : "Gear could not be saved."; setError(message); toast.error(message); }
    finally { setPending(false); }
  };

  return <form onSubmit={submit} className="max-w-2xl space-y-1"><div className="grid gap-1 sm:grid-cols-2"><FormField label="Gear name" required><input name="name" defaultValue={gear?.name} required placeholder="e.g. Trail mountain bike" className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" /></FormField><FormField label="Category" required><select name="category" defaultValue={gear?.category ?? categories[0] ?? ""} required className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary"><option value="" disabled>Select category</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></FormField></div><div className="grid gap-1 sm:grid-cols-2"><FormField label="Brand"><input name="brand" defaultValue={gear?.brand ?? ""} placeholder="e.g. Trek" className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" /></FormField><FormField label="Image URL"><input name="imageUrl" defaultValue={gear?.images?.[0] ?? ""} type="url" placeholder="https://..." className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" /><p className="mt-1.5 text-xs text-muted-foreground">Use an image URL. File uploads are not supported by the current API.</p></FormField></div><FormField label="Description"><textarea name="description" defaultValue={gear?.description ?? ""} rows={5} placeholder="Describe the gear and what renters should know." className="w-full resize-y rounded-md border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" /></FormField><div className="grid gap-1 sm:grid-cols-2"><FormField label="Price per day" required><input name="pricePerDay" defaultValue={gear?.pricePerDay} type="number" min="0" step="0.01" required className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" /></FormField><FormField label="Stock quantity" required><input name="stock" defaultValue={gear?.stock} type="number" min="0" step="1" required className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" /></FormField></div><label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-card p-3.5 text-sm font-semibold"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} className="size-4 accent-primary" />Available for rental</label>{error ? <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-3.5 py-3 text-sm text-[#991b1b]" role="alert">{error}</p> : null}<div className="flex gap-2.5 pt-3"><Button type="submit" disabled={pending}>{pending ? <><LoaderCircle className="animate-spin" />Saving...</> : gear ? "Save changes" : "Add gear"}</Button><Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button></div></form>;
}
