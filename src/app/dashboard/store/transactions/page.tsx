
"use client";
import { useState } from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { TransactionsView } from "@/components/dashboard/transactions-view";
import { initialInventory } from "@/lib/mock-data";
import { updateInventory } from "@/lib/inventory";
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem } from "@/types";

export default function TransactionsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const { toast } = useToast();

  const getInventoryTotals = (item: InventoryItem) => {
    const total = item.assets.length;
    const available = item.assets.filter(a => a.status === 'Available' && a.condition === 'Good').length;
    return { total, available };
  };

  return (
    <PEMSDashboard initialRole="Store Manager">
      <TransactionsView 
        inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} 
        onIssue={(values) => {
          const equipmentId = parseInt(values.equipmentId);
          const { updatedInventory } = updateInventory(inventory, equipmentId, {assetIds: values.assetIds}, "issue");
          setInventory(updatedInventory);
          toast({
            title: "Success",
            description: `${values.assetIds.length} unit(s) of ${inventory.find(i => i.id === equipmentId)?.name} issued.`,
          });
        }}
        onReturn={(values) => {
          const equipmentId = parseInt(values.equipmentId);
          const { updatedInventory } = updateInventory(inventory, equipmentId, {assetIds: values.assetIds}, "return", values.condition as any);
          setInventory(updatedInventory);
          toast({
            title: "Success",
            description: `${values.assetIds.length} unit(s) of ${inventory.find(i => i.id === equipmentId)?.name} returned in ${values.condition} condition.`,
          });
        }}
      />
    </PEMSDashboard>
  );
}
