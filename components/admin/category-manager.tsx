"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { categorySchema, fieldErrors } from "@/lib/validations";
import type { Category } from "@/lib/types";

function CategoryFormDialog({ category, trigger }: { category?: Category; trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(category?.name ?? "");
  const [description, setDescription] = React.useState(category?.description ?? "");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const isEdit = Boolean(category);

  const mutation = useMutation({
    mutationFn: () => {
      const parsed = categorySchema.safeParse({ name, description });
      if (!parsed.success) {
        setErrors(fieldErrors(parsed.error));
        throw new Error("validation");
      }
      setErrors({});
      return isEdit
        ? clientApiFetch<Category>(`/admin/categories/${category!.id}`, { method: "PATCH", body: parsed.data })
        : clientApiFetch<Category>("/admin/categories", { method: "POST", body: parsed.data });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Category updated." : "Category created.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Name</Label>
            <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Camping" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryManager() {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: () => clientApiFetch<Category[]>("/categories") });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => clientApiFetch(`/admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) =>
      toast.error(err instanceof ClientApiError ? err.message : "Could not delete this category (it may still have gear attached)."),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Categories</h2>
        <CategoryFormDialog
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4" /> New category
            </Button>
          }
        />
      </div>

      {categoriesQuery.isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {(categoriesQuery.data ?? []).map((cat) => (
            <li key={cat.id} className="flex items-center justify-between gap-3 p-3">
              <div>
                <p className="font-medium">{cat.name}</p>
                {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
              </div>
              <div className="flex gap-1">
                <CategoryFormDialog
                  category={cat}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete &quot;{cat.name}&quot;?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCategory.mutate(cat.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
