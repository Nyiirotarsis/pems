export type UserRole = "Store Manager" | "Finance Manager" | "HR/Admin" | "CEO" | "Director" | "IT";

export type Condition = "Good" | "Damaged" | "Lost";

export interface InventoryItem {
  id: number;
  name: string;
  total: number;
  available: number;
  lastUpdated: string;
  transactions: Transaction[];
}

export interface Transaction {
  type: 'issue' | 'return' | 'restock';
  date: Date;
  quantity: number;
  condition?: Condition;
  receivedBy?: string;
}
