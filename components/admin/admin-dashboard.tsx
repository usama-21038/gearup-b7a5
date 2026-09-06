"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOverview } from "./admin-overview";
import { UsersTable } from "./users-table";
import { AdminGearTable } from "./admin-gear-table";
import { AdminRentalsTable } from "./admin-rentals-table";
import { CategoryManager } from "./category-manager";

export function AdminDashboard({ initialTab }: { initialTab: string }) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform-wide oversight of users, gear, rentals, and categories.</p>
      </div>

      <AdminOverview />

      <Tabs
        defaultValue={initialTab}
        onValueChange={(tab) => router.push(tab === "overview" ? "/dashboard/admin" : `/dashboard/admin?tab=${tab}`)}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="gear">Gear</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-6 text-sm text-muted-foreground">
          Use the tabs above to manage users, moderate gear, review rentals platform-wide, and maintain categories.
        </TabsContent>
        <TabsContent value="users" className="pt-6">
          <UsersTable />
        </TabsContent>
        <TabsContent value="gear" className="pt-6">
          <AdminGearTable />
        </TabsContent>
        <TabsContent value="rentals" className="pt-6">
          <AdminRentalsTable />
        </TabsContent>
        <TabsContent value="categories" className="pt-6">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
