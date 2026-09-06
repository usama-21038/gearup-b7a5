"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderOverview } from "./provider-overview";
import { InventoryTable } from "./inventory-table";
import { OrdersTable } from "./orders-table";

export function ProviderDashboard({ initialTab }: { initialTab: string }) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Provider dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your gear inventory and incoming rental orders.</p>
      </div>

      <ProviderOverview />

      <Tabs
        defaultValue={initialTab}
        onValueChange={(tab) => router.push(tab === "overview" ? "/dashboard/provider" : `/dashboard/provider?tab=${tab}`)}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-6 text-sm text-muted-foreground">
          Use the Inventory tab to list new gear, and Orders to confirm, hand off, and receive returns.
        </TabsContent>
        <TabsContent value="inventory" className="pt-6">
          <InventoryTable />
        </TabsContent>
        <TabsContent value="orders" className="pt-6">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
