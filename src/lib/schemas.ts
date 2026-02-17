
import { z } from "zod";

export const issueItemSchema = z.object({
  itemId: z.string().min(1, "Please select an item."),
  quantityOut: z.coerce.number().min(1, "Quantity must be at least 1."),
});

export const issueFormSchema = z.object({
  dateOut: z.date(),
  category: z.string().min(1, "Please select a category."),
  itemsIssued: z.array(issueItemSchema).min(1, "Please add at least one item."),
  issuedTo: z.string().min(1, "Please select the receiving officer."),
  venue: z.string().min(2, "Venue/Event name is required."),
  remarks: z.string().optional(),
});

export const returnItemSchema = z.object({
  itemId: z.string(),
  itemName: z.string(),
  condition: z.string().min(1, "Please select a condition."),
});

export const returnFormSchema = z.object({
  issueId: z.string().min(1, "Please select the issue reference."),
  dateIn: z.date(),
  itemsReturned: z.array(returnItemSchema),
  remarks: z.string().optional(),
});


export const transactionFormSchema = z.object({
  equipmentId: z.string().min(1, "Please select an equipment."),
  date: z.date(),
  condition: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});

export const restockFormSchema = z.object({
  equipmentId: z.string().min(1, "Please select an equipment."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  receivedBy: z.string().min(2, "Please enter who received the items."),
});

export const requestFormSchema = z.object({
  item: z.string().min(1, "Please enter an item name."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});

export const kpiFormSchema = z.object({
    userId: z.string().min(1, "Please select a user."),
    category: z.string().min(2, "Category is required."),
    activityName: z.string().min(2, "Activity name is required."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    frequency: z.enum(["Daily", "Weekly", "Monthly", "Quarterly"]),
    startDate: z.date(),
    endDate: z.date(),
});

export const attendanceFormSchema = z.object({
    userId: z.string().min(1, "Please select a user."),
    date: z.date(),
    status: z.enum(["Present", "Absent", "Late", "On Leave"], { required_error: "Please select a status."}),
    notes: z.string().optional(),
});

export const fieldPaymentRequestSchema = z.object({
    staffId: z.string().min(1, "Please select a staff member."),
    workDescription: z.string().min(5, "Please provide a brief work description."),
    daysWorked: z.coerce.number().min(0.5, "Please enter a valid number of days."),
    rate: z.coerce.number().min(1, "Please enter a valid rate."),
    requestDate: z.date(),
})


export const visitorRegistrationSchema = z.object({
  name: z.string().min(2, "Visitor name is required."),
  reason: z.string().min(3, "Please provide a reason for the visit."),
  personVisiting: z.string().min(1, "Please select the person being visited."),
});

export const maintenanceLogSchema = z.object({
  serialNumber: z.string().min(1, "Serial Number is required."),
  itemName: z.string().min(1, "Item Name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  issueDescription: z.string().min(5, "Issue description is required."),
  hardware: z.boolean(),
  software: z.boolean(),
  cause: z.string().min(3, "Cause of damage/fault is required."),
  unitCost: z.coerce.number().optional(),
  totalCost: z.coerce.number().optional(),
  status: z.enum(["Paid", "Pending"]),
  technicianName: z.string().optional(),
  contact: z.string().optional(),
  remarks: z.string().optional(),
}).refine(data => data.hardware || data.software, {
    message: "At least one issue type (Hardware or Software) must be selected.",
    path: ["hardware"], // you can pick any of the fields to attach the error to
});

const lpoItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  quantity: z.coerce.number().min(1, "Qty must be at least 1."),
  unitPrice: z.coerce.number().min(0, "Price must be a positive number."),
});

export const lpoFormSchema = z.object({
  client: z.string().min(2, "Client name is required."),
  date: z.date(),
  status: z.enum(["Pending", "Delivered"]),
  items: z.array(lpoItemSchema).min(1, "Please add at least one item."),
  attachments: z.any().optional()
  .refine((files) => !files || files.length <= 5, `Maximum 5 documents are allowed.`),
});

const quotationItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  quantity: z.coerce.number().min(1, "Qty must be at least 1."),
  days: z.coerce.number().min(1, "Days must be at least 1."),
  unitCost: z.coerce.number().min(0, "Price must be a positive number."),
  discount: z.coerce.number().min(0).optional(),
});

export const quotationFormSchema = z.object({
  quotationNumber: z.string().default("QUO-2025-001"),
  quotationDate: z.date(),
  clientName: z.string().min(2, "Client name is required."),
  venue: z.string().min(2, "Venue is required"),
  eventDate: z.date(),
  items: z.array(quotationItemSchema).min(1, "Please add at least one item."),
  terms: z.string(),
  validity: z.string(),
  attachment: z.any().optional(),
});

export const invoiceFormSchema = z.object({
  client: z.string().min(2, "Client name is required."),
  quotationNumber: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  date: z.date(),
  dueDate: z.date(),
  amount: z.coerce.number().min(0, "Amount must be a positive number."),
  status: z.enum(["Paid", "Unpaid", "Partially Paid"]),
  attachment: z.any().optional(),
});

export const userFormSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    role: z.string({ required_error: "Please select a role."}).min(1, "Please select a role."),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
})
.refine(data => {
    // If password is provided, confirmPassword must also be provided.
    if (data.password && !data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Please confirm your new password.",
    path: ["confirmPassword"],
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


export const requisitionItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});

export const equipmentRequisitionSchema = z.object({
  eventName: z.string().min(2, "Event name is required."),
  eventDate: z.date(),
  items: z.array(requisitionItemSchema).min(1, "Please add at least one item."),
});

export const payrollFormSchema = z.object({
  staffId: z.string({required_error: "Please select a staff member."}).min(1, "Please select a staff member."),
  staffFileNo: z.string().optional(),
  position: z.string().optional(),
  tin: z.string().optional(),
  nssf: z.string().optional(),
  month: z.string().min(1, "Month is required."),
  year: z.coerce.number().min(2020, "Year must be valid."),
  basicPay: z.coerce.number().min(0, "Basic pay must be a positive number."),
  otherBenefits: z.coerce.number().min(0, "Benefits must be a positive number."),
  salaryAdvance: z.coerce.number().min(0, "Salary advance must be a positive number."),
});

export const eventRegistrySchema = z.object({
  sn: z.string().min(1, "Serial Number is required."),
  startDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endDate: z.date(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  eventDescription: z.string().min(10, "Event description is required."),
  client: z.string().min(2, "Client name is required."),
  participants: z.string().optional(),
  national: z.coerce.number().min(0, "Must be a positive number.").optional(),
  international: z.coerce.number().min(0, "Must be a positive number.").optional(),
  totalParticipants: z.coerce.number().min(0, "Total participants is required."),
  activities: z.string().optional(),
  technologyUsed: z.string().min(1, "Technology used is required."),
  volumeRecorded: z.coerce.number().min(0, "Volume must be a positive number.").optional(),
  challenges: z.string().optional(),
  achievements: z.string().optional(),
  youtubeLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  websiteLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  xLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  tiktokLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  instagramLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  linkedinLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  deliveredDescription: z.string().optional(),
  photoLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  videoLink: z.string().url("Invalid URL").optional().or(z.literal('')),
  status: z.enum(["Planned", "Ongoing", "Completed", "Delivered", "Archived", "Cancelled"]),
});
    
export const scheduledPostSchema = z.object({
  platform: z.enum(['YouTube', 'TikTok', 'Instagram', 'X', 'LinkedIn']),
  content: z.string().min(5, "Content must be at least 5 characters."),
  scheduledDate: z.date(),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

export const deviceFormSchema = z.object({
  userId: z.string().min(1, "Please select a user."),
  deviceName: z.string().min(3, "Device name is required."),
  deviceType: z.string().min(1, "Please select a device type."),
  email: z.string().email("Please enter a valid email.").optional().or(z.literal('')),
  phone: z.string().optional(),
  identifier: z.string().optional(), // IMEI
  ipAddress: z.string().optional(),
});

export const profileFormSchema = z.object({
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    avatar: z.any().optional(),
})
.refine(data => {
    if (data.password && !data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Please confirm your new password.",
    path: ["confirmPassword"],
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export const assetFormSchema = z.object({
  assetName: z.string().min(2, "Asset name is required."),
  category: z.string().min(1, "Please select a category."),
  location: z.string().min(2, "Location is required."),
  purchaseDate: z.date(),
  condition: z.string().min(1, "Please select a condition."),
  serialNumber: z.string().optional(),
  engravedNumber: z.string().optional(),
  image: z.string().optional(),
});
    

    


```
- src/lib/types/index.ts:
```ts





export type UserRole = "Store Manager" | "Finance Manager" | "HR/Admin" | "CEO" | "Director" | "Admin" | "Field Operational Officer" | "Media and Communication Officer" | "Auditor";

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

export interface PayrollRecord {
  id: number;
  staffId: number;
  month: string;
  year: number;
  basicPay: number;
  otherBenefits: number;
  salaryAdvance: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface EventRegistry {
  id: string;
  sn: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  eventDescription: string;
  client: string;
  participants?: string;
  national?: number;
  international?: number;
  totalParticipants: number;
  activities?: string;
  technologyUsed: string;
  volumeRecorded?: number;
  challenges?: string;
  achievements?: string;
  youtubeLink?: string;
  websiteLink?: string;
  xLink?: string;
  tiktokLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  whatsapp?: string;
  deliveredDescription?: string;
  photoLink?: string;
  videoLink?: string;
  status: "Planned" | "Ongoing" | "Completed" | "Delivered" | "Archived" | "Cancelled";
}

export type DeviceType = 'Smartphone' | 'Tablet' | 'Desktop' | 'Laser Scan Gun';
export type DeviceStatus = 'pending' | 'verified' | 'approved' | 'blocked';

export interface Device {
  id: string;
  userId: number;
  deviceName: string;
  deviceType: DeviceType;
  identifier: string;
  ipAddress?: string;
  status: DeviceStatus;
  verifiedByOTP: boolean;
  approvedByAdmin: boolean;
  createdAt: string;
  lastUsedAt: string;
  email?: string;
  phone?: string;
  scanCount: number;
}

export interface Album {
  id: string;
  title: string;
  client: string;
  date: string;
  photoCount: number;
  views: number;
  coverImageUrl: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  views: number;
  likes: number;
  publishedDate: string;
  thumbnailUrl: string;
  youtubeId: string;
}

export interface ScheduledPost {
  id: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'X' | 'LinkedIn';
  content: string;
  scheduledDate: string; // ISO String
  status: 'Draft' | 'Scheduled' | 'Published';
}
