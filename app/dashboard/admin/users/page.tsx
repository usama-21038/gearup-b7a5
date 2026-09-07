"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import { useConfirm } from "@/lib/confirm-context";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@/lib/types";
import { fmtDate, initials } from "@/lib/utils";
import { UserStatusBadge } from "@/components/badges";
import { SearchIcon, ShieldIcon } from "@/components/icons";
import { ErrorState, Pagination, Spinner } from "@/components/ui";

const PAGE_SIZE = 8;

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi
      .users()
      .then(setUsers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function toggleStatus(u: User) {
    if (u.id === me?.id) {
      toast.error("You can't change your own account status.");
      return;
    }
    const next = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const ok = await confirm({
      title: next === "SUSPENDED" ? `Suspend ${u.name}?` : `Reactivate ${u.name}?`,
      body:
        next === "SUSPENDED"
          ? "They won't be able to log in or use the platform until reactivated."
          : "They'll regain full access to their account immediately.",
      confirmLabel: next === "SUSPENDED" ? "Suspend" : "Activate",
      tone: next === "SUSPENDED" ? "danger" : "default",
      icon: <ShieldIcon />,
    });
    if (!ok) return;
    setBusyId(u.id);
    try {
      const updated = await adminApi.updateUserStatus(u.id, next);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
      toast.success(`${u.name} is now ${next.toLowerCase()}.`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update that user."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Users</h1>
          <p className="text-body">Manage every account on the platform.</p>
        </div>
      </div>
      <div className="card panel">
        <div className="table-toolbar">
          <div className="search-input-wrap" style={{ maxWidth: 320 }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <span className="text-small">{filtered.length} user(s)</span>
        </div>

        {loading ? (
          <div className="skel skel-line" style={{ width: 200 }} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="row-flex">
                          <div className="avatar">{initials(u.name)}</div>
                          <div>
                            <div className="cell-primary">{u.name}</div>
                            <div className="cell-sub">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.role}</td>
                      <td>{fmtDate(u.createdAt)}</td>
                      <td>
                        <UserStatusBadge status={u.status} />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {busyId === u.id ? (
                          <Spinner dark />
                        ) : (
                          <button
                            className={`btn btn-sm ${u.status === "ACTIVE" ? "btn-destructive" : "btn-secondary"}`}
                            onClick={() => toggleStatus(u)}
                            disabled={u.id === me?.id}
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
