export type UserRole = "Store Manager" | "Finance Manager" | "HR/Admin" | "CEO" | "Director" | "IT";

export type Condition = "Good" | "Damaged" | "Lost";

export interface User {
  id: number;
  username: string;
  password?: string; // Should not be sent to client
  role: UserRole;
}

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
