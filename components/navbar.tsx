"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { initials } from "@/lib/utils";
import { LogoutIcon, MenuIcon, MountainIcon, XIcon } from "./icons";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, roleHome } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="navbar">
        <div className="wrap navbar-inner">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <MountainIcon />
            </div>
            GearUp
          </Link>
          <div className="nav-links">
            <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
              Home
            </Link>
            <Link href="/gear" className={`nav-link ${pathname?.startsWith("/gear") ? "active" : ""}`}>
              Browse Gear
            </Link>
            <Link href="/gear" className="nav-link">
              Categories
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!user ? (
              <div className="nav-actions">
                <Link href="/auth/login" className="btn btn-ghost mobile-hide">
                  Log in
                </Link>
                <Link href="/auth/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            ) : (
              <div className="nav-actions">
                <Link href={roleHome()} className="btn btn-secondary mobile-hide">
                  Dashboard
                </Link>
                <Link href={roleHome()} className="user-chip">
                  <div className="avatar">{initials(user.name)}</div>
                  <span className="text-small" style={{ color: "var(--color-text)", fontWeight: 600 }}>
                    {user.name.split(" ")[0]}
                  </span>
                </Link>
              </div>
            )}
            <button className="nav-burger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={`drawer-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <div className="logo" style={{ fontSize: 16 }}>
            <div className="logo-mark">
              <MountainIcon />
            </div>
            GearUp
          </div>
          <button className="btn btn-ghost" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <XIcon />
          </button>
        </div>
        <Link href="/" onClick={() => setDrawerOpen(false)}>
          Home
        </Link>
        <Link href="/gear" onClick={() => setDrawerOpen(false)}>
          Browse Gear
        </Link>
        {user ? (
          <>
            <Link href={roleHome()} onClick={() => setDrawerOpen(false)}>
              Dashboard
            </Link>
            <hr className="divider" style={{ margin: "10px 0" }} />
            <button
              onClick={() => {
                setDrawerOpen(false);
                logout();
              }}
            >
              <LogoutIcon /> Log out
            </button>
          </>
        ) : (
          <>
            <hr className="divider" style={{ margin: "10px 0" }} />
            <Link href="/auth/login" onClick={() => setDrawerOpen(false)}>
              Log in
            </Link>
            <Link href="/auth/register" onClick={() => setDrawerOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
}
