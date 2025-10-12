
"use client";

import React from "react";
import type { InventoryItem } from "@/types";
import { InventoryView } from "./dashboard/inventory-view";
import { initialInventory } from "@/lib/mock-data";
import { useToast } from "./ui/use-toast";
import { updateInventory } from "@/lib/inventory";

export default function StoreManagerDashboard() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [inventory, setInventory] = React.useState(initialInventory);
  const { toast } = useToast();

  const getInventoryTotals = (item: InventoryItem) => {
    const total = item.assets.length;
    const available = item.assets.filter(
      (a) => a.status === "Available" && a.condition === "Good"
    ).length;
    const issued = item.assets.filter((a) => a.status === "Issued").length;
    const faulty = item.assets.filter(
      (a) => a.condition === "Faulty"
    ).length;
    return { total, available, issued, faulty };
  };

  const filteredInventory = inventory
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((item) => ({
      ...item,
      ...getInventoryTotals(item),
    }));

  const handleRestock = (values: {
    equipmentId: string;
    quantity: number;
    receivedBy: string;
  }) => {
    const equipmentId = parseInt(values.equipmentId);
    const { updatedInventory } = updateInventory(
      inventory,
      equipmentId,
      { quantity: values.quantity },
      "restock"
    );
    setInventory(updatedInventory);
    toast({
      title: "Success",
      description: `${values.quantity} units of ${
        inventory.find((i) => i.id === equipmentId)?.name
      } restocked by ${values.receivedBy}.`,
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
