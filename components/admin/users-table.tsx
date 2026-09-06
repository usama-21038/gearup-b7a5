"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserStatusBadge } from "@/components/shared/status-badges";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { formatDate } from "@/lib/utils";
import type { User } from "@/lib/types";

export function UsersTable() {
  const queryClient = useQueryClient();
  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: () => clientApiFetch<User[]>("/admin/users") });

  const toggleStatus = useMutation({
    mutationFn: (user: User) =>
      clientApiFetch<User>(`/admin/users/${user.id}`, {
        method: "PATCH",
        body: { status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" },
      }),
    onSuccess: () => {
      toast.success("User status updated.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => toast.error(err instanceof ClientApiError ? err.message : "Could not update this user."),
  });

  if (usersQuery.isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(usersQuery.data ?? []).map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <UserStatusBadge status={user.status} />
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant={user.status === "ACTIVE" ? "outline" : "default"}
                disabled={user.role === "ADMIN" || toggleStatus.isPending}
                onClick={() => toggleStatus.mutate(user)}
              >
                {user.status === "ACTIVE" ? "Suspend" : "Activate"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
