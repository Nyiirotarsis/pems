

export type UserRole = "Store Manager" | "Finance Manager" | "HR/Admin" | "CEO" | "Director" | "IT Managers" | "Field Operational Officer" | "Media and Communication Officer" | "Auditor";

export type Condition = "New" | "Good" | "Fair" | "Damaged" | "Under Repair" | "Faulty";

export type InventoryStatus = "Available" | "Out" | "Under Repair" | "Reserved";

export interface User {
  id: number;
  username: string;
  password?: string; // Should not be sent to client
  role: UserRole;
  staffFileNo?: string;
  name?: string;
  tin?: string;
  nssf?: string;
}

export interface InventoryItem {
  id: string; // Corresponds to document ID, e.g., "LED-55-2025-001"
  itemName: string;
  category: string;
  serialNo: string;
  description: string;
  quantityAvailable: number;
  unitCost: number;
  totalCost: number;
  condition: Condition;
  location: string;
  supplier: string;
  datePurchased: string;
  lastServiced: string;
  status: InventoryStatus;
  issuedTo: string | null;
  issuedBy: string | null;
  venue?: string | null;
  dateIssued: string | null;
  returnDate: string | null;
  imageURL?: string;
  addedBy: string; // UID of user
  createdAt: string; // ISO 8601 string
}

export interface InventoryIssue {
  issueId: string;
  dateOut: string;
  category: string;
  itemsIssued: {
    itemId: string;
    itemName: string;
    quantity: number;
  }[];
  venue: string;
  issuedTo: string;
  issuedBy: UserRole | string;
  status: "Out" | "Returned" | "Partially Returned";
  remarks?: string;
  createdAt: string;
  dateIn?: string;
  itemsReturned?: {
    itemId: string;
    condition: Condition;
  }[];
  receivedBy?: UserRole | string;
}

export interface Requisition {
    id: string;
    eventName: string;
    eventDate: string;
    requestedBy: UserRole | string;
    status: "Pending" | "Approved" | "Rejected" | "Processed";
    items: {
        itemName: string;
        quantity: number;
        status: "Available" | "Not Available" | "Partially Available";
    }[];
    createdAt: string;
}

export interface RepairLog {
  repairId: string;
  itemId: string;
  itemName: string;
  problem: string;
  reportedBy: string;
  handledBy: string;
  repairDate: string;
  cost: number;
  status: "Pending" | "In Progress" | "Fixed" | "Cannot Fix";
}


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

export interface FinanceModuleProps {
    role: UserRole | null;
    status?: FinancialStatus;
}

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
    client: string;
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
    quotationNumber: string;
    date: string;
    dueDate: string;
    amount: number;
    status: "Paid" | "Unpaid" | "Partially Paid";
    payments: Payment[];
    file?: string;
}

export interface Payment {
    id: string;
    invoiceNumber: string;
    quotationNumber?: string;
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

// Visitor Management Types
export interface Visitor {
    id: number;
    name: string;
    reason: string;
    timeIn: string;
    personVisiting: UserRole; // Storing the role they are visiting
}

// Reports View
export interface ReportsViewProps {
    inventory: InventoryItem[];
    role: UserRole | null;
    quotations: Quotation[];
    lpos: LPO[];
    invoices: Invoice[];
    payments: Payment[];
    kpis: Kpi[];
    attendance: AttendanceRecord[];
}

// Maintenance Log Types
export interface MaintenanceLog {
    id: string;
    serialNumber: string;
    itemName: string;
    quantity: number;
    issueDescription: string;
    hardware: boolean;
    software: boolean;
    cause: string;
    unitCost: number;
    totalCost: number;
    status: "Paid" | "Pending";
    technicianName?: string;
    contact?: string;
    remarks?: string;
}

    