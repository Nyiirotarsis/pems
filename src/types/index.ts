export type UserRole = "Store Manager" | "Finance Manager" | "HR/Admin" | "CEO" | "Director" | "IT";

export type Condition = "Good" | "Damaged" | "Lost" | "Faulty";

export interface User {
  id: number;
  username: string;
  password?: string; // Should not be sent to client
  role: UserRole;
}

export interface Asset {
  id: string; // Engraved serial number
  equipmentId: number;
  condition: Condition;
  status: 'Available' | 'Issued';
  purchaseDate: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  assets: Asset[]; // Now tracks individual assets
  lastUpdated: string;
  transactions: Transaction[];
}

// Derived properties will be calculated on the fly, so we remove them from the core type.
// total: number; 
// available: number;

export interface Transaction {
  type: 'issue' | 'return' | 'restock';
  date: Date;
  quantity: number;
  condition?: Condition;
  receivedBy?: string;
  assetIds?: string[];
}

export interface AppNotification {
  id: number;
  message: string;
  date: string;
  read: boolean;
  forRoles: UserRole[];
}

// Finance Module Types
export type FinancialStatus = "Pending" | "Approved" | "Rejected" | "Paid" | "Partially Paid" | "Delivered" | "Unpaid";

export interface Quotation {
  id: string;
  number: string;
  service: string;
  date: string;
  amount: number;
  status: FinancialStatus;
  file?: string;
}

export interface LPO {
    id: string;
    number: string;
    supplier: string;
    date: string;
    amount: number;
    status: "Pending" | "Delivered";
    file?: string;
}

export interface Invoice {
    id: string;
    number: string;
    supplier: string;
    date: string;
    dueDate: string;
    amount: number;
    status: "Paid" | "Unpaid" | "Partially Paid";
    file?: string;
}

export interface Payment {
    id: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    method: "Bank" | "Cash" | "Mobile Money";
    receipt?: string;
}
