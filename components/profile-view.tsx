"use client";

import { useAuth } from "@/lib/auth-context";
import { fmtDate, initials } from "@/lib/utils";
import { UserStatusBadge } from "./badges";
import { ShieldIcon } from "./icons";

export function ProfileView({ note }: { note: string }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Profile</h1>
          <p className="text-body">Your GearUp account details.</p>
        </div>
      </div>
      <div className="card panel" style={{ maxWidth: 520 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
            {initials(user.name)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{user.name}</div>
            <div className="text-small">{user.email}</div>
          </div>
        </div>
        <div className="spec-row">
          <span>Role</span>
          <span style={{ fontWeight: 600 }}>{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</span>
        </div>
        <div className="spec-row">
          <span>Status</span>
          <UserStatusBadge status={user.status} />
        </div>
        <div className="spec-row">
          <span>Phone</span>
          <span style={{ fontWeight: 600 }}>{user.phone || "—"}</span>
        </div>
        <div className="spec-row" style={{ borderBottom: "none" }}>
          <span>Member since</span>
          <span style={{ fontWeight: 600 }}>{fmtDate(user.createdAt)}</span>
        </div>
      </div>
      <div className="card panel" style={{ maxWidth: 520, display: "flex", gap: 12 }}>
        <div style={{ color: "var(--color-text-secondary)", flexShrink: 0 }}>
          <ShieldIcon />
        </div>
        <p className="text-small" style={{ margin: 0 }}>
          {note}
        </p>
      </div>
    </div>
  );
}
