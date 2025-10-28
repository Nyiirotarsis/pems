
"use client";
import { useState } from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { TransactionsView } from "@/components/dashboard/transactions-view";
import { initialInventory, mockInventoryIssues } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem, InventoryIssue } from "@/types";
import { format } from "date-fns";

export default function TransactionsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [inventoryIssues, setInventoryIssues] = useState<InventoryIssue[]>(mockInventoryIssues);
  const { toast } = useToast();

  const handleIssue = (values: any) => {
    // 1. Create new issue record
    const newIssue: InventoryIssue = {
        issueId: `ISS-${Date.now().toString().slice(-5)}`,
        dateOut: format(values.dateOut, 'yyyy-MM-dd'),
        category: values.category,
        itemsIssued: values.itemsIssued.map((item: any) => ({
            itemId: item.itemId,
            itemName: inventory.find(i => i.id === item.itemId)?.itemName || 'Unknown',
            quantity: item.quantityOut,
        })),
        venue: values.venue,
        issuedTo: values.issuedTo,
        issuedBy: 'storemanager', // Logged in user
        status: 'Out',
        remarks: values.remarks,
        createdAt: new Date().toISOString(),
    };
    setInventoryIssues(prev => [newIssue, ...prev]);

    // 2. Update inventory quantities
    let errorOccurred = false;
    const updatedInventory = inventory.map(invItem => {
        const issuedItem = values.itemsIssued.find((i: any) => i.itemId === invItem.id);
        if (issuedItem) {
            if (invItem.quantityAvailable < issuedItem.quantityOut) {
                toast({ variant: 'destructive', title: 'Error', description: `Not enough ${invItem.itemName} in stock.`});
                errorOccurred = true;
                return invItem;
            }
            return {
                ...invItem,
                quantityAvailable: invItem.quantityAvailable - issuedItem.quantityOut,
                status: (invItem.quantityAvailable - issuedItem.quantityOut > 0) ? 'Available' : 'Out',
                issuedTo: values.issuedTo,
                venue: values.venue,
                dateIssued: new Date().toISOString(),
            };
        }
        return invItem;
    });

    if (!errorOccurred) {
        setInventory(updatedInventory);
        toast({
            title: "Success",
            description: `Items for ${values.venue} have been successfully issued.`,
        });
    } else {
        // Revert issue creation if inventory update fails
        setInventoryIssues(prev => prev.filter(iss => iss.issueId !== newIssue.issueId));
    }
  };

  const handleReturn = (values: any) => {
     // 1. Find and update the issue record
    const updatedIssues = inventoryIssues.map(issue => {
        if (issue.issueId === values.issueId) {
            return {
                ...issue,
                status: 'Returned' as 'Returned', // Assuming full return for now
                dateIn: format(values.dateIn, 'yyyy-MM-dd'),
                itemsReturned: values.itemsReturned,
                receivedBy: 'storemanager', // Logged in user
                remarks: `${issue.remarks || ''}\nReturn Remarks: ${values.remarks || ''}`
            };
        }
        return issue;
    });
    setInventoryIssues(updatedIssues);

     // 2. Update inventory quantities and conditions
    const updatedInventory = inventory.map(invItem => {
        const returnedItem = values.itemsReturned.find((i: any) => i.itemId === invItem.id);
        const originalIssuedItem = inventoryIssues.find(i => i.issueId === values.issueId)?.itemsIssued.find(i => i.itemId === invItem.id);

        if (returnedItem && originalIssuedItem) {
            const newQuantity = invItem.quantityAvailable + originalIssuedItem.quantity;
            return {
                ...invItem,
                quantityAvailable: newQuantity,
                condition: returnedItem.condition,
                status: returnedItem.condition === 'Faulty' || returnedItem.condition === 'Under Repair' ? 'Under Repair' : 'Available',
                issuedTo: null,
                venue: null,
                dateIssued: null,
            };
        }
        return invItem;
    });

    setInventory(updatedInventory);
    toast({
        title: "Success",
        description: `Items for issue ID ${values.issueId} have been returned.`,
    });
  };

  return (
    <PEMSDashboard initialRole="Store Manager">
      <TransactionsView 
        inventory={inventory} 
        inventoryIssues={inventoryIssues}
        onIssue={handleIssue}
        onReturn={handleReturn}
      />
    </PEMSDashboard>
  );
}
