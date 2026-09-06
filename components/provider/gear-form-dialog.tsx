"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { gearSchema, updateGearSchema, fieldErrors } from "@/lib/validations";
import type { Category, GearItem } from "@/lib/types";

export function GearFormDialog({ gear, trigger }: { gear?: GearItem; trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const isEdit = Boolean(gear);
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => clientApiFetch<Category[]>("/categories"),
    enabled: open,
  });

  const [name, setName] = React.useState(gear?.name ?? "");
  const [description, setDescription] = React.useState(gear?.description ?? "");
  const [brand, setBrand] = React.useState(gear?.brand ?? "");
  const [images, setImages] = React.useState<string[]>(gear?.images && gear.images.length ? gear.images : [""]);
  const [pricePerDay, setPricePerDay] = React.useState(gear?.pricePerDay ?? "");
  const [totalQuantity, setTotalQuantity] = React.useState(String(gear?.totalQuantity ?? "1"));
  const [categoryId, setCategoryId] = React.useState(gear?.categoryId ?? "");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async () => {
      const cleanImages = images.map((i) => i.trim()).filter(Boolean);
      const payload = {
        name,
        description: description || undefined,
        brand: brand || undefined,
        images: cleanImages,
        pricePerDay,
        totalQuantity,
        categoryId,
      };
      const schema = isEdit ? updateGearSchema : gearSchema;
      const parsed = schema.safeParse(payload);
      if (!parsed.success) {
        setErrors(fieldErrors(parsed.error));
        throw new Error("validation");
      }
      setErrors({});
      if (isEdit && gear) {
        return clientApiFetch<GearItem>(`/provider/gear/${gear.id}`, { method: "PUT", body: parsed.data });
      }
      return clientApiFetch<GearItem>("/provider/gear", { method: "POST", body: parsed.data });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Gear updated." : "Gear added to your inventory.");
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      setOpen(false);
    },
    onError: (err) => {
      if (err instanceof ClientApiError) toast.error(err.message);
      else if (err.message !== "validation") toast.error("Something went wrong.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit gear" : "Add gear"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="gear-name">Name</Label>
            <Input id="gear-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="4-Person Camping Tent" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gear-brand">Brand</Label>
            <Input id="gear-brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Coleman" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gear-desc">Description</Label>
            <Textarea id="gear-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {(categoriesQuery.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="gear-price">Price per day (USD)</Label>
              <Input id="gear-price" type="number" min="0" step="0.01" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />
              {errors.pricePerDay && <p className="text-xs text-destructive">{errors.pricePerDay}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gear-qty">Total quantity</Label>
              <Input id="gear-qty" type="number" min="1" value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} />
              {errors.totalQuantity && <p className="text-xs text-destructive">{errors.totalQuantity}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Image URLs</Label>
            {images.map((url, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={url}
                  placeholder="https://images.example.com/tent.jpg"
                  onChange={(e) => setImages((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  disabled={images.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}
            {images.length < 6 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setImages((prev) => [...prev, ""])}>
                <Plus className="h-4 w-4" /> Add another image
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Paste direct image links (any hosted photo URL). Leave blank to use a placeholder photo.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Add gear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
