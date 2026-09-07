"use client";

import { UserStatusAction } from "@/components/admin/admin-actions";
import { EmptyState, Pagination } from "@/components/ui/gearup";
import type { User } from "@/types/user";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 8;

function roleLabel(role: string) { return role === "USER" ? "Customer" : role === "AUTHOR" ? "Provider" : role === "ADMIN" ? "Admin" : role; }
function joinedDate(value?: string) { if (!value) return "Date unavailable"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date); }

export function AdminUsers({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => users.filter((user) => !search || user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())), [users, search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <div><div className="mb-5 flex flex-wrap items-center gap-3"><div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name or email..." className="h-11 w-full rounded-md border border-input bg-card pl-9 pr-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" aria-label="Search users" /></div><span className="text-sm text-muted-foreground">{filtered.length} users</span></div>{visible.length ? <><div className="overflow-x-auto"><table className="gearup-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead><tbody>{visible.map((user) => <tr key={user.id}><td className="font-semibold">{user.name}</td><td>{user.email}</td><td>{roleLabel(user.role)}</td><td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.activeStatus === "Active" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"}`}>{user.activeStatus}</span></td><td>{joinedDate(user.createdAt)}</td><td><UserStatusAction user={user} onUpdated={(updated) => setUsers((current) => current.map((item) => item.id === updated.id ? updated : item))} /></td></tr>)}</tbody></table></div><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></> : <EmptyState title="No matching users" description="Try a different search term." />}</div>;
}
