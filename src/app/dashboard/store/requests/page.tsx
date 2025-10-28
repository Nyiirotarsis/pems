
"use client";
import { useState } from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { RequestsView } from "@/components/dashboard/requests-view";
import { initialInventory } from "@/lib/mock-data";
import type { InventoryItem } from "@/types";

export default function RequestsPage() {
  const [inventory] = useState<InventoryItem[]>(initialInventory);

  const getInventoryTotals = (item: InventoryItem) => {
    const total = item.quantityAvailable;
    const available = item.status === 'Available' ? item.quantityAvailable : 0;
    return { total, available };
  };

  return (
    <PEMSDashboard initialRole="Store Manager">
      <RequestsView 
        inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} 
        onNotify={(message, roles) => {
            console.log("Notification:", message, "for roles:", roles);
        }}
        role="Store Manager"
      />
    </PEMSDashboard>
  );
}

