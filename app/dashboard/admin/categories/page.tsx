"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminApi, categoryApi, ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import { useConfirm } from "@/lib/confirm-context";
import type { Category } from "@/lib/types";
import { CategoryIcon, EditIcon, PlusIcon, TrashIcon, categoryTintClass } from "@/components/icons";
import { EmptyState, ErrorState, FieldError, Spinner } from "@/components/ui";

export default function AdminCategoriesPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const load = () => {
    setLoading(true);
    categoryApi
      .list()
      .then(setCategories)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setCreating(true);
    try {
      const cat = await adminApi.createCategory({ name: name.trim(), description: description.trim() || undefined });
      setCategories((prev) => [...prev, cat]);
      setName("");
      setDescription("");
      toast.success(`"${cat.name}" category created.`);
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors());
      toast.error(getErrorMessage(err, "Couldn't create that category."));
    } finally {
      setCreating(false);
    }
  }

  function startEdit(c: Category) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDescription(c.description || "");
  }

  async function saveEdit(id: string) {
    setBusyId(id);
    try {
      const updated = await adminApi.updateCategory(id, { name: editName.trim(), description: editDescription.trim() || undefined });
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      toast.success("Category updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update that category."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(c: Category) {
    const ok = await confirm({
      title: `Delete "${c.name}"?`,
      body: "Existing gear using this category won't be reassigned automatically. Only delete categories with no active listings.",
      confirmLabel: "Delete",
      tone: "danger",
      icon: <TrashIcon size={18} />,
    });
    if (!ok) return;
    setBusyId(c.id);
    try {
      await adminApi.deleteCategory(c.id);
      setCategories((prev) => prev.filter((x) => x.id !== c.id));
      toast.success(`"${c.name}" was deleted.`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete that category — it may still have gear listed under it."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Categories</h1>
          <p className="text-body">Categories providers choose from when listing gear.</p>
        </div>
      </div>

      <form className="card panel" onSubmit={handleCreate}>
        <h3 className="text-h3" style={{ marginBottom: 14 }}>
          Add a category
        </h3>
        <div className="grid-2">
          <div className={`field ${fieldErrors.name ? "has-error" : ""}`}>
            <label>
              Name <span className="req">*</span>
            </label>
            <input type="text" placeholder="e.g. Snow Sports" required value={name} onChange={(e) => setName(e.target.value)} />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className={`field ${fieldErrors.description ? "has-error" : ""}`}>
            <label>Description</label>
            <input type="text" placeholder="Optional short description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <FieldError message={fieldErrors.description} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={creating}>
          {creating ? (
            <>
              <Spinner /> Adding...
            </>
          ) : (
            <>
              <PlusIcon size={14} /> Add category
            </>
          )}
        </button>
      </form>

      <div className="card panel">
        {loading ? (
          <div className="skel skel-line" style={{ width: 200 }} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories yet" body="Add your first category above so providers can start listing gear." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    {editingId === c.id ? (
                      <>
                        <td>
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </td>
                        <td>
                          <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => saveEdit(c.id)} disabled={busyId === c.id}>
                              {busyId === c.id ? <Spinner /> : "Save"}
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <div className="row-flex">
                            <div className={`mini-thumb ${categoryTintClass(c.name)}`}>
                              <CategoryIcon category={c.name} size={18} />
                            </div>
                            <span className="cell-primary">{c.name}</span>
                          </div>
                        </td>
                        <td className="cell-sub">{c.description || "—"}</td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <button className="btn btn-outline btn-sm" onClick={() => startEdit(c)}>
                              <EditIcon /> Edit
                            </button>
                            <button className="btn btn-destructive btn-sm" onClick={() => handleDelete(c)} disabled={busyId === c.id}>
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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
