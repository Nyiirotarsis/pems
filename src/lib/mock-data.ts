

import type { UserRole, Condition, InventoryItem, User, Quotation, LPO, Invoice, Payment, Asset, Kpi, AttendanceRecord } from "@/types";

export const ROLES: UserRole[] = ["Store Manager", "Finance Manager", "HR/Admin", "CEO", "Director", "IT Managers"];

export const assetCategories = ["IT Equipment", "AV Equipment", "Office Furniture", "Vehicles", "Software"];

export const CONDITIONS: Condition[] = ["Good", "Damaged", "Lost", "Faulty"];

export const mockUsers: User[] = [
    { id: 1, username: 'ceo', password: '123', role: 'CEO' },
    { id: 2, username: 'director', password: '123', role: 'Director' },
    { id: 3, username: 'financemanager', password: '123', role: 'Finance Manager' },
    { id: 4, username: 'hr', password: '123', role: 'HR/Admin' },
    { id: 5, username: 'it', password: '123', role: 'IT Managers' },
    { id: 6, username: 'storemanager', password: '123', role: 'Store Manager' },
];

function generateAssets(equipmentId: number, name: string, count: number, { faultyCount = 0, issuedCount = 0, damagedCount = 0 } = {}): Asset[] {
    const assets: Asset[] = [];
    const namePrefix = name.substring(0, 3).toUpperCase();
    let issuedCounter = 0;
    for (let i = 1; i <= count; i++) {
        let condition: Condition = 'Good';
        let status: 'Available' | 'Issued' = 'Available';
        let assignedTo: string | undefined = undefined;

        if (i <= faultyCount) {
            condition = 'Faulty';
        } else if (i <= faultyCount + damagedCount) {
            condition = 'Damaged';
        }

        if (condition === 'Good' && issuedCounter < issuedCount) {
            status = 'Issued';
            // Assign to a random user for variety
            assignedTo = mockUsers[Math.floor(Math.random() * mockUsers.length)].username;
            issuedCounter++;
        }

        assets.push({
            id: `${namePrefix}-${equipmentId}-${String(i).padStart(4, '0')}`,
            equipmentId,
            condition,
            status,
            assignedTo,
            purchaseDate: `2023-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
        });
    }
    return assets;
}


export const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Microphone",
    category: "AV Equipment",
    assets: generateAssets(1, "Microphone", 50, { faultyCount: 2, issuedCount: 10 }),
    lastUpdated: "2023-10-26",
    transactions: [],
  },
  {
    id: 2,
    name: "Projector",
    category: "AV Equipment",
    assets: generateAssets(2, "Projector", 20, { faultyCount: 1, issuedCount: 5 }),
    lastUpdated: "2023-10-25",
    transactions: [],
  },
  {
    id: 3,
    name: "Laptop",
    category: "IT Equipment",
    assets: generateAssets(3, "Laptop", 100, { faultyCount: 5, issuedCount: 40, damagedCount: 3 }),
    lastUpdated: "2023-10-27",
    transactions: [],
  },
  {
    id: 4,
    name: "Conference Speaker",
    category: "AV Equipment",
    assets: generateAssets(4, "Conference Speaker", 30, { issuedCount: 8 }),
    lastUpdated: "2023-10-22",
    transactions: [],
  },
  {
    id: 5,
    name: "HDMI Cable (10ft)",
    category: "IT Equipment",
    assets: generateAssets(5, "HDMI Cable", 200, { faultyCount: 10, damagedCount: 20 }),
    lastUpdated: "2023-10-27",
    transactions: [],
  },
  {
    id: 6,
    name: "Whiteboard",
    category: "Office Furniture",
    assets: generateAssets(6, "Whiteboard", 15, { issuedCount: 2 }),
    lastUpdated: "2023-10-24",
    transactions: [],
  },
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
        supplier: 'Tech Solutions Ltd.', 
        date: '2024-07-02', 
        items: [{ description: 'Cat6 Ethernet Cables', quantity: 50, unitPrice: 30 }],
        amount: 1500, 
        status: 'Delivered' 
    },
    { 
        id: 'L002', 
        number: 'LPO-2024-002', 
        supplier: 'Creative Designs Inc.', 
        date: '2024-07-08', 
        items: [{ description: 'Stage Backdrop Banner', quantity: 1, unitPrice: 3200 }],
        amount: 3200, 
        status: 'Pending' 
    },
];

export const mockInvoices: Invoice[] = [
    { id: 'I001', number: 'INV-2024-001', supplier: 'Tech Solutions Ltd.', date: '2024-07-15', dueDate: '2024-08-15', amount: 1500, status: 'Paid' },
    { id: 'I002', number: 'INV-2024-002', supplier: 'Global Logistics', date: '2024-07-20', dueDate: '2024-08-20', amount: 8000, status: 'Unpaid' },
    { id: 'I003', number: 'INV-2024-003', supplier: 'Office Supreme', date: '2024-07-22', dueDate: '2024-08-22', amount: 2200, status: 'Partially Paid' },
];

export const mockPayments: Payment[] = [
    { id: 'P001', invoiceNumber: 'INV-2024-001', date: '2024-07-25', amount: 1500, method: 'Bank' },
    { id: 'P002', invoiceNumber: 'INV-2024-003', date: '2024-07-26', amount: 1000, method: 'Mobile Money' },
];

export const mockKpis: Kpi[] = [
    { id: 1, userId: 5, category: 'IT Support', activityName: 'Resolve Support Tickets', description: 'Resolve 95% of tier 1 support tickets within 24 hours.', frequency: 'Weekly' },
    { id: 2, userId: 5, category: 'Infrastructure', activityName: 'Server Uptime', description: 'Maintain 99.9% server uptime across all production servers.', frequency: 'Monthly' },
    { id: 3, userId: 6, category: 'Inventory Management', activityName: 'Stock Accuracy', description: 'Ensure physical stock count matches system records with 98% accuracy.', frequency: 'Quarterly' },
    { id: 4, userId: 3, category: 'Financial Reporting', activityName: 'Monthly Closures', description: 'Complete monthly financial closure and reporting by the 5th working day.', frequency: 'Monthly' },
    { id: 5, userId: 1, category: 'Strategic Growth', activityName: 'Market Expansion', description: 'Secure 2 new strategic partnerships in the designated new market.', frequency: 'Quarterly' },
];

export const mockAttendance: AttendanceRecord[] = [
    { id: 1, userId: 3, date: '2024-07-28', status: 'Present' },
    { id: 2, userId: 4, date: '2024-07-28', status: 'Present' },
    { id: 3, userId: 5, date: '2024-07-28', status: 'Late', notes: 'Arrived at 9:15 AM' },
    { id: 4, userId: 6, date: '2024-07-28', status: 'Present' },
    { id: 5, userId: 1, date: '2024-07-28', status: 'On Leave' },
];

// Duplicate export of USERS removed to avoid conflicts
export { USERS } from './mock-data-users';
