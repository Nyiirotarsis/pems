
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

  // The new inventory structure does not have nested assets,
  // so the totals are now directly on the item.
  const inventoryWithTotals = inventory.map(item => ({
      ...item,
      available: item.status === 'Available' ? item.quantityAvailable : 0,
      total: item.quantityAvailable, // This might need re-evaluation based on desired logic
      faulty: item.condition === 'Faulty' || item.condition === 'Under Repair' ? item.quantityAvailable : 0,
  }));

  const filteredInventory = inventoryWithTotals.filter((item) =>
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
