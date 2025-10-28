
"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { InventoryItem } from "@/types";
import { InventoryView } from "./dashboard/inventory-view";
import { initialInventory } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import AnalyticsDashboard from "./dashboard/analytics-dashboard";

export default function StoreManagerDashboard() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [inventory, setInventory] = React.useState(initialInventory);
  const { toast } = useToast();

  const filteredInventory = inventory.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestock = (values: {
    equipmentId: string;
    quantity: number;
    receivedBy: string;
  }) => {
    const item = inventory.find(i => i.id === values.equipmentId);
    toast({
      title: "Restock Logged (Demo)",
      description: `${values.quantity} units of ${item?.itemName} logged by ${values.receivedBy}.`,
    });
  };

  return (
    <Tabs defaultValue="overview">
        <TabsList>
            <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
            <TabsTrigger value="inventory">Detailed Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <AnalyticsDashboard inventory={inventory} />
        </TabsContent>
        <TabsContent value="inventory">
            <InventoryView
              inventory={filteredInventory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onRestock={handleRestock}
            />
        </TabsContent>
    </Tabs>
  );
}
