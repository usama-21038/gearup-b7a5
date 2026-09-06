"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/app/(auth)/_actions/auth-actions";

export function UserMenu({
  name,
  email,
  role,
  dashboardPath,
}: {
  name: string;
  email: string;
  role: string;
  dashboardPath: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{initials || <UserIcon className="h-4 w-4" />}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{name.split(" ")[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
            <span className="mt-1 text-xs font-normal capitalize text-muted-foreground">{role.toLowerCase()} account</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardPath} className="cursor-pointer">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction} className="w-full">
          <button type="submit" className="w-full">
            <DropdownMenuItem asChild>
              <div className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut />
                Log out
              </div>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
