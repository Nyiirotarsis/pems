

export type UserRole = "Store Manager" | "Finance Manager" | "HR/Admin" | "CEO" | "Director" | "IT Managers";

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
  assignedTo?: string; // Username of person it's assigned to
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
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

interface LpoItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface LPO {
    id: string;
    number: string;
    supplier: string;
    date: string;
    items: LpoItem[];
    amount: number; // This can be calculated from items, but storing for simplicity
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

// KPI Tracker Types
export type KpiStatus = "Pending" | "In Progress" | "Completed";

export interface Kpi {
    id: number;
    userId: number;
    category: string;
    activityName: string;
    description: string;
    frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
    startDate: string;
    endDate: string;
    status: KpiStatus;
    finishedDate?: string;
}

// Attendance Types
export type AttendanceStatus = "Present" | "Absent" | "Late" | "On Leave";

export interface AttendanceRecord {
  id: number;
  userId: number;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

// New detailed quotation type
export interface QuotationItem {
  description: string;
  quantity: number;
  days: number;
  unitCost: number;
}

export interface DetailedQuotation {
  id: string;
  number: string;
  quotationDate: string;
  clientName: string;
  venue: string;
  eventDate: string;
  items: QuotationItem[];
  terms: string;
  validity: string;
  status: FinancialStatus;
}


// Field Staff Payment Types
export interface FieldStaff {
    id: number;
    name: string;
    role: string;
    contact: string;
}

export type FieldPaymentStatus = 'Pending' | 'Paid' | 'Acknowledged';

export interface FieldPaymentRequest {
    id: number;
    staffId: number;
    staffName: string;
    workDescription: string;
    daysWorked: number;
    rate: number;
    totalAmount: number;
    status: FieldPaymentStatus;
    requestDate: string;
    paymentDate?: string;
    receiptFile?: string;
}

    