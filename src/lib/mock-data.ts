import type { UserRole, Condition, InventoryItem, User, Quotation, LPO, Invoice, Payment, Kpi, AttendanceRecord, FieldPaymentRequest, Visitor, MaintenanceLog, InventoryIssue } from "@/types";
import { mockFieldStaff } from "./mock-field-staff";

export const ROLES: UserRole[] = ["Store Manager", "IT Managers", "CEO", "Director", "Finance Manager", "HR/Admin", "Field Operational Officer"];

export const assetCategories = [
    "Sound Equipment", 
    "Lighting & Visuals",
    "Streaming & Production Gear",
    "Event Setup Materials",
    "Electrical & Networking",
    "Transport & Logistics"
];

export const CONDITIONS: Condition[] = ["New", "Good", "Fair", "Damaged", "Under Repair", "Faulty"];

export const USERS: User[] = [
    { id: 1, username: 'ceo', password: '123', role: 'CEO' },
    { id: 2, username: 'director', password: '123', role: 'Director' },
    { id: 3, username: 'financemanager', password: '123', role: 'Finance Manager' },
    { id: 4, username: 'hr', password: '123', role: 'HR/Admin' },
    { id: 5, username: 'it', password: '123', role: 'IT Managers' },
    { id: 6, username: 'storemanager', password: '123', role: 'Store Manager' },
    { id: 7, username: 'fieldops', password: '123', role: 'Field Operational Officer' },
];

export const mockUsers: User[] = USERS;


export const initialInventory: InventoryItem[] = [
  {
    id: "MIC-W-2025-001",
    itemName: "Wireless Microphone Kit",
    category: "Sound Equipment",
    serialNo: "MIC-W-2025-001",
    description: "Shure BLX288/PG58 Dual Channel Wireless Microphone System",
    quantityAvailable: 10,
    unitCost: 850000,
    totalCost: 8500000,
    condition: "Good",
    location: "Central Store - Kampala HQ",
    supplier: "Sound Innovations",
    datePurchased: "2025-01-20",
    lastServiced: "2025-07-15",
    status: "Available",
    issuedTo: null,
    issuedBy: null,
    dateIssued: null,
    returnDate: null,
    addedBy: "UID_OF_IT_MANAGER",
    createdAt: new Date().toISOString(),
  },
  {
    id: "LED-55-2025-001",
    itemName: "LED Display Screen 55inch",
    category: "Lighting & Visuals",
    serialNo: "LED-55-2025-001",
    description: "55-inch outdoor LED display with HDMI input",
    quantityAvailable: 4,
    unitCost: 1200000,
    totalCost: 4800000,
    condition: "Good",
    location: "Central Store - Kampala HQ",
    supplier: "Vision Electronics Ltd",
    datePurchased: "2025-03-15",
    lastServiced: "2025-08-02",
    status: "Available",
    issuedTo: null,
    issuedBy: null,
    dateIssued: null,
    returnDate: null,
    addedBy: "UID_OF_IT_MANAGER",
    createdAt: new Date().toISOString()
  },
  {
    id: "CAM-DSLR-2024-005",
    itemName: "Canon EOS R5 Camera",
    category: "Streaming & Production Gear",
    serialNo: "CAM-DSLR-2024-005",
    description: "Full-frame mirrorless camera for high-quality video production.",
    quantityAvailable: 5,
    unitCost: 15000000,
    totalCost: 75000000,
    condition: "New",
    location: "Production Room",
    supplier: "Camera Planet",
    datePurchased: "2024-05-10",
    lastServiced: "2025-05-10",
    status: "Available",
    issuedTo: null,
    issuedBy: null,
    dateIssued: null,
    returnDate: null,
    addedBy: "UID_OF_IT_MANAGER",
    createdAt: new Date().toISOString()
  },
  {
    id: "TENT-10X10-2023-015",
    itemName: "Event Tent 10x10m",
    category: "Event Setup Materials",
    serialNo: "TENT-10X10-2023-015",
    description: "Large canopy tent for outdoor events.",
    quantityAvailable: 8,
    unitCost: 2500000,
    totalCost: 20000000,
    condition: "Fair",
    location: "Warehouse B",
    supplier: "Shelter Solutions",
    datePurchased: "2023-11-01",
    lastServiced: "2025-06-01",
    status: "Available",
    issuedTo: null,
    issuedBy: null,
    dateIssued: null,
    returnDate: null,
    addedBy: "UID_OF_STORE_MANAGER",
    createdAt: new Date().toISOString()
  },
   {
    id: "GEN-5KVA-2024-002",
    itemName: "5KVA Diesel Generator",
    category: "Electrical & Networking",
    serialNo: "GEN-5KVA-2024-002",
    description: "Portable generator for event power backup.",
    quantityAvailable: 2,
    unitCost: 4000000,
    totalCost: 8000000,
    condition: "Good",
    location: "Central Store - Kampala HQ",
    supplier: "Powerline Uganda",
    datePurchased: "2024-02-18",
    lastServiced: "2025-08-18",
    status: "Under Repair",
    issuedTo: null,
    issuedBy: null,
    dateIssued: null,
    returnDate: null,
    addedBy: "UID_OF_IT_MANAGER",
    createdAt: new Date().toISOString()
  },
];


export const mockInventoryIssues: InventoryIssue[] = [
    {
        issueId: 'ISS-2025-010',
        dateOut: '2024-07-25T09:30:00Z',
        category: 'Sound Equipment',
        itemsIssued: [
            { itemId: 'MIC-W-2025-001', itemName: 'Wireless Microphone Kit', quantity: 2 }
        ],
        venue: 'Serena Conference Hall',
        issuedTo: 'Alice Sound',
        issuedBy: 'storemanager',
        status: 'Out',
        remarks: 'Used for corporate event',
        createdAt: '2024-07-25T09:30:00Z'
    }
];


export const mockQuotations: Quotation[] = [
    { id: 'Q001', number: 'QUO-2024-001', service: 'Office Stationery Supply', date: '2024-07-01', amount: 1500, status: 'Approved' },
    { id: 'Q002', number: 'QUO-2024-002', service: 'Catering for Annual Meeting', date: '2024-07-05', amount: 4500, status: 'Pending' },
    { id: 'Q003', number: 'QUO-2024-003', service: 'IT Equipment Maintenance', date: '2024-07-10', amount: 2500, status: 'Rejected' },
];

export const mockLPOs: LPO[] = [
    { 
        id: 'L001', 
        number: 'LPO-2024-001', 
        client: 'Tech Solutions Ltd.', 
        date: '2024-07-02', 
        items: [{ description: 'Cat6 Ethernet Cables', quantity: 50, unitPrice: 30 }],
        amount: 1500, 
        status: 'Delivered' 
    },
    { 
        id: 'L002', 
        number: 'LPO-2024-002', 
        client: 'Creative Designs Inc.', 
        date: '2024-07-08', 
        items: [{ description: 'Stage Backdrop Banner', quantity: 1, unitPrice: 3200 }],
        amount: 3200, 
        status: 'Pending' 
    },
];

export const mockPayments: Payment[] = [
    { id: 'P001', invoiceNumber: 'INV-2024-001', quotationNumber: 'QUO-2024-001', date: '2024-07-25', amount: 1500, method: 'Bank' },
    { id: 'P002', invoiceNumber: 'INV-2024-003', quotationNumber: 'QUO-2024-003', date: '2024-07-26', amount: 1000, method: 'Mobile Money' },
];

export const mockInvoices: Invoice[] = [
    { id: 'I001', number: 'INV-2024-001', supplier: 'Tech Solutions Ltd.', quotationNumber: 'QUO-2024-001', date: '2024-07-15', dueDate: '2024-08-15', amount: 1500, status: 'Paid', payments: mockPayments.filter(p => p.invoiceNumber === 'INV-2024-001') },
    { id: 'I002', number: 'INV-2024-002', supplier: 'Global Logistics', quotationNumber: 'QUO-2024-002', date: '2024-07-20', dueDate: '2024-08-20', amount: 8000, status: 'Unpaid', payments: [] },
    { id: 'I003', number: 'INV-2024-003', supplier: 'Office Supreme', quotationNumber: 'QUO-2024-003', date: '2024-07-22', dueDate: '2024-08-22', amount: 2200, status: 'Partially Paid', payments: mockPayments.filter(p => p.invoiceNumber === 'INV-2024-003') },
];


export const mockKpis: Kpi[] = [
    { id: 1, userId: 5, category: 'IT Support', activityName: 'Resolve Support Tickets', description: 'Resolve 95% of tier 1 support tickets within 24 hours.', frequency: 'Weekly', startDate: '2024-07-01', endDate: '2024-09-30', status: 'In Progress' },
    { id: 2, userId: 5, category: 'Infrastructure', activityName: 'Server Uptime', description: 'Maintain 99.9% server uptime across all production servers.', frequency: 'Monthly', startDate: '2024-07-01', endDate: '2024-07-31', status: 'Completed', finishedDate: '2024-07-28' },
    { id: 3, userId: 6, category: 'Inventory Management', activityName: 'Stock Accuracy', description: 'Ensure physical stock count matches system records with 98% accuracy.', frequency: 'Quarterly', startDate: '2024-07-01', endDate: '2024-09-30', status: 'Pending' },
    { id: 4, userId: 3, category: 'Financial Reporting', activityName: 'Monthly Closures', description: 'Complete monthly financial closure and reporting by the 5th working day.', frequency: 'Monthly', startDate: '2024-08-01', endDate: '2024-08-05', status: 'Pending' },
    { id: 5, userId: 1, category: 'Strategic Growth', activityName: 'Market Expansion', description: 'Secure 2 new strategic partnerships in the designated new market.', frequency: 'Quarterly', startDate: '2024-07-01', endDate: '2024-09-30', status: 'In Progress' },
];

export const mockAttendance: AttendanceRecord[] = [
    { id: 1, userId: 3, date: '2024-07-28', status: 'Present' },
    { id: 2, userId: 4, date: '2024-07-28', status: 'Present' },
    { id: 3, userId: 5, date: '2024-07-28', status: 'Late', notes: 'Arrived at 9:15 AM' },
    { id: 4, userId: 6, date: '2024-07-28', status: 'Present' },
    { id: 5, userId: 1, date: '2024-07-28', status: 'On Leave' },
];

export const mockFieldPaymentRequests: FieldPaymentRequest[] = [
    {
        id: 1,
        staffId: 1,
        staffName: "John Power",
        workDescription: "Stage setup for Judiciary event",
        daysWorked: 2,
        rate: 150000,
        totalAmount: 300000,
        status: 'Paid',
        requestDate: "2024-07-25",
        paymentDate: "2024-07-26",
    },
    {
        id: 2,
        staffId: 2,
        staffName: "Alice Sound",
        workDescription: "Sound engineering for music concert",
        daysWorked: 1,
        rate: 250000,
        totalAmount: 250000,
        status: 'Pending',
        requestDate: "2024-07-28",
    }
];

export const mockVisitors: Visitor[] = [
    { id: 1, name: "John Okello", reason: "Delivery", timeIn: "2024-09-03T10:15:00", personVisiting: "Store Manager" },
    { id: 2, name: "Sarah Namatovu", reason: "Interview", timeIn: "2024-09-03T09:45:00", personVisiting: "HR/Admin" },
    { id: 3, name: "Peter Musoke", reason: "Meeting", timeIn: "2024-09-03T11:00:00", personVisiting: "CEO" },
];

export const mockMaintenanceLogs: MaintenanceLog[] = [
    {
        id: "1",
        serialNumber: "LAP-3-0001",
        itemName: "Laptop",
        quantity: 1,
        issueDescription: "Screen is flickering and has dead pixels.",
        hardware: true,
        software: false,
        cause: "Accidental drop",
        unitCost: 150000,
        totalCost: 150000,
        status: "Paid",
        technicianName: "Alex Ray",
        contact: "078-111-2222",
        remarks: "Screen replaced and tested.",
    },
    {
        id: "2",
        serialNumber: "PRO-2-0005",
        itemName: "Projector",
        quantity: 1,
        issueDescription: "Projector lamp is dim and needs replacement.",
        hardware: true,
        software: false,
        cause: "End of life cycle",
        unitCost: 250000,
        totalCost: 250000,
        status: "Pending",
        technicianName: "In-house IT",
        contact: "Ext 105",
        remarks: "Lamp ordered, awaiting delivery.",
    }
];


export { mockFieldStaff } from './mock-field-staff';
