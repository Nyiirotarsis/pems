
"use client";

import React from "react";
import type { InventoryItem } from "@/types";
import { InventoryView } from "./dashboard/inventory-view";
import { initialInventory } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { updateInventory } from "@/lib/inventory";

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
    // This logic needs to be updated to match the new data structure.
    // For now, it will show a toast.
    const item = inventory.find(i => i.id === values.equipmentId);
    toast({
      title: "Restock Logged (Demo)",
      description: `${values.quantity} units of ${item?.itemName} logged by ${values.receivedBy}.`,
    });
  };

  return (
    <InventoryView
      inventory={filteredInventory}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onRestock={handleRestock}
    />
  );
}

