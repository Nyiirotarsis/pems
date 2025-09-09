import type { UserRole, Condition, InventoryItem, User, Quotation, LPO, Invoice, Payment, Asset } from "@/types";

export const ROLES: UserRole[] = ["Store Manager", "Finance Manager", "HR/Admin", "CEO", "Director", "IT"];

export const CONDITIONS: Condition[] = ["Good", "Damaged", "Lost", "Faulty"];

export const USERS: User[] = [
    { id: 1, username: 'ceo', password: '123', role: 'CEO' },
    { id: 2, username: 'director', password: '123', role: 'Director' },
    { id: 3, username: 'financemanager', password: '123', role: 'Finance Manager' },
    { id: 4, username: 'hr', password: '123', role: 'HR/Admin' },
    { id: 5, username: 'it', password: '123', role: 'IT' },
    { id: 6, username: 'storemanager', password: '123', role: 'Store Manager' },
];

function generateAssets(equipmentId: number, name: string, count: number, faultyCount = 0): Asset[] {
    const assets: Asset[] = [];
    const namePrefix = name.substring(0, 3).toUpperCase();
    for (let i = 1; i <= count; i++) {
        const isFaulty = i <= faultyCount;
        assets.push({
            id: `${namePrefix}-${equipmentId}-${String(i).padStart(4, '0')}`,
            equipmentId,
            condition: isFaulty ? 'Faulty' : 'Good',
            status: 'Available',
            purchaseDate: '2023-01-15'
        });
    }
    return assets;
}


export const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Microphone",
    assets: generateAssets(1, "Microphone", 50, 2),
    lastUpdated: "2023-10-26",
    transactions: [],
  },
  {
    id: 2,
    name: "Projector",
    assets: generateAssets(2, "Projector", 20, 1),
    lastUpdated: "2023-10-25",
    transactions: [],
  },
  {
    id: 3,
    name: "Laptop",
    assets: generateAssets(3, "Laptop", 100, 5),
    lastUpdated: "2023-10-27",
    transactions: [],
  },
  {
    id: 4,
    name: "Conference Speaker",
    assets: generateAssets(4, "Conference Speaker", 30, 0),
    lastUpdated: "2023-10-22",
    transactions: [],
  },
  {
    id: 5,
    name: "HDMI Cable (10ft)",
    assets: generateAssets(5, "HDMI Cable", 200, 10),
    lastUpdated: "2023-10-27",
    transactions: [],
  },
  {
    id: 6,
    name: "Whiteboard",
    assets: generateAssets(6, "Whiteboard", 15),
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
    { id: 'L001', number: 'LPO-2024-001', supplier: 'Tech Solutions Ltd.', date: '2024-07-02', amount: 1500, status: 'Delivered' },
    { id: 'L002', number: 'LPO-2024-002', supplier: 'Creative Designs Inc.', date: '2024-07-08', amount: 3200, status: 'Pending' },
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
