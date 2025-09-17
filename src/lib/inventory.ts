
import type { InventoryItem, Asset, Condition, UserRole } from "@/types";

export function updateInventory(
  currentInventory: InventoryItem[],
  equipmentId: number,
  transactionPayload: { assetIds: string[] } | { quantity: number },
  type: "issue" | "return" | "restock",
  condition?: Condition,
  userRole?: UserRole
) {
  let affectedAssets: Asset[] = [];
  const updatedInventory = currentInventory.map((item) => {
    if (item.id === equipmentId) {
      let updatedAssetsList = [...item.assets];

      if (type === 'restock' && 'quantity' in transactionPayload) {
        const { quantity } = transactionPayload;
        const namePrefix = item.name.substring(0, 3).toUpperCase();
        const lastAssetIdNum =
          item.assets.length > 0
            ? parseInt(
                item.assets[item.assets.length - 1].id.split("-").pop() || "0"
              )
            : 0;

        for (let i = 1; i <= quantity; i++) {
          const newAsset: Asset = {
            id: `${namePrefix}-${item.id}-${String(lastAssetIdNum + i).padStart(
              4,
              "0"
            )}`,
            equipmentId: item.id,
            condition: "Good",
            status: "Available",
            purchaseDate: new Date().toISOString().split("T")[0],
          };
          updatedAssetsList.push(newAsset);
          affectedAssets.push(newAsset);
        }
      } else if (type === 'issue' && 'assetIds' in transactionPayload) {
        const { assetIds } = transactionPayload;
        affectedAssets = updatedAssetsList.filter(a => assetIds.includes(a.id));

        affectedAssets.forEach((a) => {
          const asset = updatedAssetsList.find((ua) => ua.id === a.id);
          if (asset && asset.status === 'Available') {
            asset.status = "Issued";
            asset.assignedTo = userRole || "Unknown"; // Assign to current role for demo
          }
        });
      } else if (type === 'return' && 'assetIds' in transactionPayload) {
        const { assetIds } = transactionPayload;
        affectedAssets = updatedAssetsList.filter(a => assetIds.includes(a.id));
        
        affectedAssets.forEach((a) => {
          const asset = updatedAssetsList.find((ua) => ua.id === a.id);
          if (asset && asset.status === 'Issued') {
            asset.status = "Available";
            asset.condition = condition || "Good";
            delete asset.assignedTo;
          }
        });
      }

      return {
        ...item,
        assets: updatedAssetsList,
        lastUpdated: new Date().toISOString().split("T")[0],
      };
    }
    return item;
  });

  return { updatedInventory, affectedAssets };
}
