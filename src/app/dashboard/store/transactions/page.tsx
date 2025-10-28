
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
    const total = item.quantityAvailable;
    const available = item.status === 'Available' ? item.quantityAvailable : 0;
    return { total, available };
  };

  return (
    <PEMSDashboard initialRole="Store Manager">
      <TransactionsView 
        inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} 
        onIssue={(values) => {
          const { updatedInventory } = updateInventory(inventory, values.equipmentId, {quantity: values.quantity}, "issue");
          setInventory(updatedInventory);
          toast({
            title: "Success",
            description: `${values.quantity} unit(s) of ${inventory.find(i => i.id === values.equipmentId)?.itemName} issued.`,
          });
        }}
        onReturn={(values) => {
          const { updatedInventory } = updateInventory(inventory, values.equipmentId, {quantity: values.quantity}, "return", values.condition as any);
          setInventory(updatedInventory);
          toast({
            title: "Success",
            description: `${values.quantity} unit(s) of ${inventory.find(i => i.id === values.equipmentId)?.itemName} returned in ${values.condition} condition.`,
          });
        }}
      />
    </PEMSDashboard>
  );
}

