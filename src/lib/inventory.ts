
import type { InventoryItem, Condition, UserRole } from "@/types";

// This file needs to be updated to work with a Firestore backend.
// The functions below are placeholders that operate on the mock data.

/**
 * Updates the inventory based on a transaction.
 * This is a placeholder and should be replaced with Firestore transactions.
 * @param currentInventory - The current state of the inventory.
 * @param equipmentId - The ID of the equipment to update.
 * @param transactionPayload - The details of the transaction.
 * @param type - The type of transaction.
 * @param condition - The condition of the item, for returns.
 * @param userRole - The role of the user performing the action.
 * @returns The updated inventory and the assets affected.
 */
export function updateInventory(
  currentInventory: InventoryItem[],
  equipmentId: string, // Changed to string to match new ID type
  transactionPayload: { assetIds?: string[]; quantity?: number },
  type: "issue" | "return" | "restock",
  condition?: Condition,
  userRole?: UserRole
) {
  const updatedInventory = currentInventory.map((item) => {
    if (item.id === equipmentId) {
      const newItem = { ...item };
      switch (type) {
        case 'issue':
          if (transactionPayload.quantity && newItem.quantityAvailable >= transactionPayload.quantity) {
            newItem.quantityAvailable -= transactionPayload.quantity;
            newItem.status = newItem.quantityAvailable > 0 ? 'Available' : 'Issued';
            newItem.issuedTo = userRole || "Unknown";
            newItem.dateIssued = new Date().toISOString();
          }
          break;
        case 'return':
          if (transactionPayload.quantity) {
            newItem.quantityAvailable += transactionPayload.quantity;
            newItem.status = 'Available';
            newItem.condition = condition || 'Good';
            newItem.issuedTo = null;
            newItem.dateIssued = null;
          }
          break;
        case 'restock':
          if (transactionPayload.quantity) {
            newItem.quantityAvailable += transactionPayload.quantity;
          }
          break;
      }
      newItem.totalCost = newItem.quantityAvailable * newItem.unitCost;
      return newItem;
    }
    return item;
  });

  // Since we no longer manage individual assets in the frontend mock,
  // the affectedAssets array is left empty.
  return { updatedInventory, affectedAssets: [] };
}
