
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileDown,
  FileUp,
  PlusCircle
} from "lucide-react";
import type { InventoryItem } from "@/types";
import { InventoryView } from "./dashboard/inventory-view";
import { initialInventory } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import AnalyticsDashboard from "./dashboard/analytics-dashboard";
import { Button } from "./ui/button";

export default function StoreManagerDashboard() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [inventory, setInventory] = React.useState(initialInventory);
  const { toast } = useToast();
  const router = useRouter();

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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <TabsList>
                <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
                <TabsTrigger value="inventory">Detailed Inventory</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
                <Button onClick={() => router.push('/dashboard/assets/new')}>
                    <PlusCircle className="mr-2" /> Add New Asset
                </Button>
                <Button variant="outline">
                    <FileDown className="mr-2" /> Export
                </Button>
                <Button variant="outline">
                    <FileUp className="mr-2" /> Import
                </Button>
            </div>
        </div>
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
