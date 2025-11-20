
"use client";
import { useState } from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { RequestsView } from "@/components/dashboard/requests-view";
import { initialInventory } from "@/lib/mock-data";
import type { InventoryItem } from "@/types";

export default function FieldOpsRequestsPage() {
  const [inventory] = useState<InventoryItem[]>(initialInventory);

  const getInventoryTotals = (item: InventoryItem) => {
    const total = item.quantityAvailable;
    const available = item.status === 'Available' ? item.quantityAvailable : 0;
    return { total, available };
  };

  return (
    <PEMSDashboard initialRole="Field Operational Officer">
      <RequestsView 
        inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} 
        onNotify={(message, roles) => {
            // In a real app, this would be a server action to send notifications
            console.log("Notification Sent:", message, "to roles:", roles);
        }}
        role="Field Operational Officer"
      />
    </PEMSDashboard>
  );
}
