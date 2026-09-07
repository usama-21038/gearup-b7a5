"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/service/auth/logout";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import type { CurrentUserResponse } from "@/types/user";

// Navigation items configuration
const navItems = [
  { label: "Home", href: "/" },
  { label: "Browse Gear", href: "/gear" },
];

// User menu items configuration
const userMenuItems = [
  { label: "Profile", icon: User, action: "profile" },
  { label: "Settings", icon: Settings, action: "settings" },
];

type NavbarProps = {
  user : CurrentUserResponse
}

export function Navbar({user} : NavbarProps) {
    const router = useRouter()
  const handleUserMenuAction = async (action: string) => {

    if(action === "logout"){
        await logout();
        toast.success("User Logged Out Successfully!");
        router.push("/login");
    }
  };

  return (
    <nav className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-bold text-primary">
              GearUp
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:flex md:items-center md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Dropdown */}
          {
            user.success ? (
                <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {user.data?.profile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.data?.profile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.action}
                    onClick={() => handleUserMenuAction(item.action)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                await handleUserMenuAction("logout");
              }}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            ) : <Link href={"/login"} >
                   <Button className="cursor-pointer">
                        Login
                   </Button>
            </Link>
          }
        </div>
      </div>
    </nav>
  );
}
