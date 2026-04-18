
import type { UserRole, Condition, InventoryItem, User, Quotation, LPO, Invoice, Payment, Kpi, AttendanceRecord, FieldPaymentRequest, Visitor, MaintenanceLog, InventoryIssue, Requisition, PayrollRecord, EventRegistry, Device, Album, YouTubeVideo, ScheduledPost, DeviceType, LeaveRequest, JobOpening, Applicant, ExitProcess } from "@/types";
import { mockFieldStaff } from "./mock-field-staff";

export const ROLES: UserRole[] = ["Store Manager", "Admin", "CEO", "Director", "Finance Manager", "HR/Admin", "Field Operational Officer", "Media and Communication Officer", "Auditor"];

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
    { id: 1, username: 'ceo', password: '123', role: 'CEO', name: 'Chris Executive' },
    { id: 2, username: 'director', password: '123', role: 'Director', staffFileNo: "PE-003", name: "Barbra Margret Neema", tin: "1003456789", nssf: "2003456789" },
    { id: 3, username: 'financemanager', password: '123', role: 'Finance Manager', staffFileNo: "PE-001", name: "Busingye Shilla Allen", tin: "1001234567", nssf: "2001234567" },
    { id: 4, username: 'hr', password: '123', role: 'HR/Admin', staffFileNo: "PE-002", name: "Sarah Kamusiime", tin: "1002345678", nssf: "2002345678" },
    { id: 5, username: 'admin', password: '123', role: 'Admin', staffFileNo: "PE-004", name: "Nyiiro Tarsis Ibrahim", tin: "1004567890", nssf: "2004567890" },
    { id: 6, username: 'storemanager', password: '123', role: 'Store Manager', staffFileNo: "PE-005", name: "Ngota Steven", tin: "1005678901", nssf: "2005678901" },
    { id: 7, username: 'fieldops', password: '123', role: 'Field Operational Officer', name: 'Frank Field' },
    { id: 8, username: 'media', password: '123', role: 'Media and Communication Officer', name: 'Mona Media' },
    { id: 11, username: 'auditor', password: '123', role: 'Auditor', name: 'Audi Aguilar' },
];


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
    imageURL: "https://picsum.photos/seed/mic-kit/400/400",
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
    createdAt: new Date().toISOString(),
    imageURL: "https://picsum.photos/seed/led-screen/400/400",
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
    createdAt: new Date().toISOString(),
    imageURL: "https://picsum.photos/seed/camera/400/400",
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

export const mockRequisitions: Requisition[] = [
    {
        id: "REQ-001",
        eventName: "Judiciary Conference",
        eventDate: "2024-08-15",
        requestedBy: "Field Operational Officer",
        status: "Pending",
        items: [
            { itemName: "Wireless Microphone Kit", quantity: 4, status: "Available" },
            { itemName: "LED Display Screen 55inch", quantity: 2, status: "Available" },
            { itemName: "5KVA Diesel Generator", quantity: 1, status: "Not Available" },
        ],
        createdAt: "2024-08-01T10:00:00Z"
    },
    {
        id: "REQ-002",
        eventName: "TechCorp AGM",
        eventDate: "2024-08-20",
        requestedBy: "Field Operational Officer",
        status: "Issued",
        items: [
            { itemName: "LED Display Screen 55inch", quantity: 1, status: "Available" },
            { itemName: "Event Tent 10x10m", quantity: 2, status: "Available" },
        ],
        createdAt: "2024-08-05T09:00:00Z",
        logisticsType: "Bodaboda",
        vehicleNumberPlate: "UFA 345M",
        transporterName: "Kato Joseph",
        transporterPhone: "0771234567",
        transporterResidence: "Kira Town",
        companyEscort: "Ngota Steven",
        deliveryVenue: "Kampala Serena Hotel",
        issuedDate: "2024-08-19T08:30:00Z"
    },
    {
        id: "REQ-003",
        eventName: "Music Festival Setup",
        eventDate: "2024-08-25",
        requestedBy: "Field Operational Officer",
        status: "Issued",
        items: [
            { itemName: "Wireless Microphone Kit", quantity: 2, status: "Available" },
        ],
        createdAt: "2024-08-10T11:00:00Z",
        logisticsType: "Truck",
        vehicleNumberPlate: "UBJ 123X",
        transporterName: "Ssali Logistics Ltd",
        transporterPhone: "0759998888",
        transporterResidence: "Namanve Industrial Area",
        companyEscort: "Sarah Kamusiime",
        deliveryVenue: "Lugogo Cricket Oval",
        issuedDate: "2024-08-24T06:00:00Z"
    },
    {
        id: "REQ-004",
        eventName: "Corporate Retreat Workshop",
        eventDate: "2024-08-10",
        requestedBy: "Field Operational Officer",
        status: "Pending Return",
        items: [
            { itemName: "Event Tent 10x10m", quantity: 1, status: "Available", returnCondition: "Good" },
            { itemName: "5KVA Diesel Generator", quantity: 1, status: "Available", returnCondition: "Damaged", damageNotes: "Engine failed mid-event, needs overhaul." },
        ],
        createdAt: "2024-08-01T10:00:00Z",
        logisticsType: "Truck",
        vehicleNumberPlate: "UAK 567B",
        transporterName: "Mukiibi Transport",
        transporterPhone: "0788123456",
        transporterResidence: "Nansana",
        companyEscort: "Sarah Kamusiime",
        deliveryVenue: "Entebbe Botanical Gardens",
        issuedDate: "2024-08-09T07:00:00Z",
        eventEndDate: "2024-08-11T18:00:00Z",
        returnLogisticsType: "Truck",
        returnVehiclePlate: "UAK 567B",
        returnTransporterName: "Mukiibi Transport",
        returnTransporterPhone: "0788123456",
        returnEscort: "Sarah Kamusiime"
    },
    {
        id: "REQ-005",
        eventName: "Parliamentary Debate Broadcast",
        eventDate: "2024-07-15",
        requestedBy: "Field Operational Officer",
        status: "Returned/Cleared",
        items: [
            { itemName: "Canon EOS R5 Camera", quantity: 2, status: "Available", returnCondition: "Good" },
            { itemName: "Wireless Microphone Kit", quantity: 4, status: "Available", returnCondition: "Good" },
        ],
        createdAt: "2024-07-10T09:00:00Z",
        logisticsType: "Company Vehicle",
        vehicleNumberPlate: "PEMS-01",
        transporterName: "In-house Driver",
        transporterPhone: "Ex 102",
        transporterResidence: "HQ",
        companyEscort: "Audi Aguilar",
        deliveryVenue: "Parliamentary Building",
        issuedDate: "2024-07-14T10:00:00Z",
        eventEndDate: "2024-07-16T16:00:00Z",
        returnLogisticsType: "Company Vehicle",
        returnVehiclePlate: "PEMS-01",
        returnTransporterName: "In-house Driver",
        returnTransporterPhone: "Ex 102",
        returnEscort: "Audi Aguilar",
        clearedDate: "2024-07-17T09:00:00Z"
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

export const mockPayrollData: PayrollRecord[] = [
    {
        id: 1,
        staffId: 3,
        month: 'July',
        year: 2024,
        basicPay: 5000000,
        otherBenefits: 500000,
        salaryAdvance: 0,
        status: 'Approved',
    },
    {
        id: 2,
        staffId: 4,
        month: 'July',
        year: 2024,
        basicPay: 7000000,
        otherBenefits: 1000000,
        salaryAdvance: 500000,
        status: 'Pending',
    }
];

export const mockEventRegistry: EventRegistry[] = [
    {
        id: "EVT-001",
        sn: "1",
        startDate: "2024-08-01",
        startTime: "09:00",
        endDate: "2024-08-01",
        endTime: "17:00",
        eventDescription: "Annual General Meeting for TechCorp",
        client: "TechCorp",
        participants: "Shareholders, Board Members, Media",
        national: 150,
        international: 20,
        totalParticipants: 170,
        activities: "Presentations, Q&A Session, Voting, Networking Lunch",
        technologyUsed: "Live streaming setup, multiple cameras, presentation systems, wireless mics",
        volumeRecorded: 250,
        challenges: "Minor audio feedback issue, resolved quickly.",
        achievements: "Flawless stream with over 500 online viewers.",
        youtubeLink: "https://youtube.com/watch?v=example",
        websiteLink: "https://example.com/blog/techcorp-agm-2024",
        status: "Completed",
    },
    {
        id: "EVT-002",
        sn: "2",
        startDate: "2024-09-15",
        startTime: "10:00",
        endDate: "2024-09-15",
        endTime: "14:00",
        eventDescription: "Product Launch: Fusion X",
        client: "Innovate Inc.",
        participants: "Media, Influencers, General Public",
        national: 300,
        international: 5,
        totalParticipants: 305,
        activities: "Keynote, Product Demos, Press Conference",
        technologyUsed: "Large LED wall, professional lighting, multi-camera production",
        volumeRecorded: 450,
        challenges: "Last minute change in speaker lineup.",
        achievements: "High social media engagement, positive press coverage.",
        status: "Planned",
    },
    {
        id: "EVT-003",
        sn: "3",
        startDate: "2024-07-20",
        startTime: "10:00",
        endDate: "2024-07-20",
        endTime: "13:00",
        eventDescription: "Internal Training Session",
        client: "Internal",
        participants: "Staff",
        national: 40,
        international: 0,
        totalParticipants: 40,
        activities: "Training on new software",
        technologyUsed: "Zoom, Projector",
        volumeRecorded: 15,
        challenges: "N/A",
        achievements: "All staff trained successfully.",
        status: "Cancelled",
    }
];

export const DEVICE_TYPES: DeviceType[] = ['Smartphone', 'Tablet', 'Desktop', 'Laser Scan Gun'];

export const mockDevices: Device[] = [
    {
        id: 'dev-001',
        userId: 5, // Admin
        deviceName: "Admin's MacBook Pro",
        deviceType: 'Desktop',
        identifier: 'imei-auto-12345',
        ipAddress: '192.168.1.101',
        status: 'approved',
        verifiedByOTP: true,
        approvedByAdmin: true,
        createdAt: '2024-08-01T10:00:00Z',
        lastUsedAt: '2024-09-04T14:00:00Z',
        email: 'admin@pacificevents.com',
        phone: '0771234567',
        scanCount: 152,
    },
    {
        id: 'dev-002',
        userId: 6, // Store Manager
        deviceName: "Store's Zebra Scanner",
        deviceType: 'Laser Scan Gun',
        identifier: 'imei-auto-67890',
        ipAddress: '192.168.1.102',
        status: 'approved',
        verifiedByOTP: true,
        approvedByAdmin: true,
        createdAt: '2024-08-05T11:00:00Z',
        lastUsedAt: '2024-09-03T18:00:00Z',
        email: 'storemanager@pacificevents.com',
        phone: '0772345678',
        scanCount: 890,
    },
    {
        id: 'dev-003',
        userId: 7, // Field Ops
        deviceName: "Sarah's iPhone 13",
        deviceType: 'Smartphone',
        identifier: 'imei-auto-13579',
        ipAddress: '192.168.1.103',
        status: 'verified',
        verifiedByOTP: true,
        approvedByAdmin: false,
        createdAt: '2024-09-01T09:00:00Z',
        lastUsedAt: '2024-09-01T09:05:00Z',
        email: 'fieldops@pacificevents.com',
        phone: '0773456789',
        scanCount: 45,
    },
    {
        id: 'dev-004',
        userId: 7, // Field Ops
        deviceName: "Field Team's Tablet",
        deviceType: 'Tablet',
        identifier: 'imei-auto-24680',
        ipAddress: '192.168.1.104',
        status: 'blocked',
        verifiedByOTP: false,
        approvedByAdmin: false,
        createdAt: '2024-08-20T15:00:00Z',
        lastUsedAt: '2024-08-20T15:00:00Z',
        email: 'fieldops-tablet@pacificevents.com',
        phone: '0774567890',
        scanCount: 12,
    },
    {
        id: 'dev-005',
        userId: 7, // Field Ops
        deviceName: "New Android Phone",
        deviceType: 'Smartphone',
        identifier: 'imei-auto-97531',
        ipAddress: '192.168.1.105',
        status: 'pending',
        verifiedByOTP: false,
        approvedByAdmin: false,
        createdAt: '2024-09-05T10:00:00Z',
        lastUsedAt: '2024-09-05T10:00:00Z',
        email: '',
        phone: '',
        scanCount: 0,
    },
    {
        id: 'dev-006',
        userId: 6, // Store Manager
        deviceName: "Old Samsung Tablet",
        deviceType: 'Tablet',
        identifier: 'imei-auto-86420',
        ipAddress: '192.168.1.106',
        status: 'approved',
        verifiedByOTP: true,
        approvedByAdmin: true,
        createdAt: '2023-01-15T11:00:00Z',
        lastUsedAt: '2024-05-10T12:00:00Z', // Idle
        email: 'storemanager@pacificevents.com',
        phone: '0772345678',
        scanCount: 1205,
    },
];

export const mockAlbums: Album[] = [
    { 
        id: 'ALB-001', 
        title: 'Judiciary Annual Conference 2024', 
        client: 'Judiciary', 
        date: '2024-08-15', 
        photoCount: 250, 
        views: 1200,
        coverImageUrl: 'https://picsum.photos/seed/album1/600/400'
    },
    { 
        id: 'ALB-002', 
        title: 'TechCorp AGM', 
        client: 'TechCorp', 
        date: '2024-08-01', 
        photoCount: 180, 
        views: 850,
        coverImageUrl: 'https://picsum.photos/seed/album2/600/400'
    },
    { 
        id: 'ALB-003', 
        title: 'Innovate Inc. Product Launch', 
        client: 'Innovate Inc.', 
        date: '2024-09-15', 
        photoCount: 320, 
        views: 2500,
        coverImageUrl: 'https://picsum.photos/seed/album3/600/400'
    },
    { 
        id: 'ALB-004', 
        title: 'National Health Summit', 
        client: 'Ministry of Health', 
        date: '2024-06-20', 
        photoCount: 450, 
        views: 3100,
        coverImageUrl: 'https://picsum.photos/seed/album4/600/400'
    }
];

export const mockYouTubeVideos: YouTubeVideo[] = [
    {
        id: 'vid-001',
        title: 'Judiciary Annual Conference 2024 Highlights',
        views: 12500,
        likes: 750,
        publishedDate: '2024-08-20',
        thumbnailUrl: 'https://picsum.photos/seed/yt1/480/270',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'vid-002',
        title: 'Behind the Scenes: TechCorp AGM Setup',
        views: 8200,
        likes: 420,
        publishedDate: '2024-08-05',
        thumbnailUrl: 'https://picsum.photos/seed/yt2/480/270',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'vid-003',
        title: 'Innovate Inc. Product Launch | Full Presentation',
        views: 25000,
        likes: 1200,
        publishedDate: '2024-09-18',
        thumbnailUrl: 'https://picsum.photos/seed/yt3/480/270',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'vid-004',
        title: 'Expert Interview: The Future of Event Technology',
        views: 5300,
        likes: 310,
        publishedDate: '2024-07-10',
        thumbnailUrl: 'https://picsum.photos/seed/yt4/480/270',
        youtubeId: 'dQw4w9WgXcQ'
    },
    {
        id: 'vid-005',
        title: 'Our Top 5 Event Management Tips for 2025',
        views: 18000,
        likes: 980,
        publishedDate: '2024-10-01',
        thumbnailUrl: 'https://picsum.photos/seed/yt5/480/270',
        youtubeId: 'dQw4w9WgXcQ'
    }
];

export const mockScheduledPosts: ScheduledPost[] = [
    { id: 'post-1', platform: 'Instagram', content: 'Highlights from the Judiciary Annual Conference. #EventProfs #Judiciary2024', scheduledDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), status: 'Scheduled' },
    { id: 'post-2', platform: 'X', content: 'Live now! Tune into the TechCorp AGM. #LiveStream #AnnualMeeting', scheduledDate: new Date().toISOString(), status: 'Published' },
    { id: 'post-3', platform: 'LinkedIn', content: 'We are proud to have provided full technical support for the National Health Summit. A look at how we ensured a seamless virtual and physical experience for all attendees.', scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), status: 'Draft' },
];

export const mockLeaveRequests: LeaveRequest[] = [
    {
        id: 1,
        userId: 3, 
        leaveType: "Annual",
        startDate: "2024-09-10",
        endDate: "2024-09-15",
        reason: "Personal vacation.",
        status: "Approved",
        requestedDate: "2024-08-20",
        reviewedBy: "CEO",
        reviewDate: "2024-08-21"
    },
    {
        id: 2,
        userId: 4, 
        leaveType: "Sick",
        startDate: "2024-08-28",
        endDate: "2024-08-29",
        reason: "Feeling unwell, doctor's appointment.",
        status: "Pending",
        requestedDate: "2024-08-28"
    },
    {
        id: 3,
        userId: 6,
        leaveType: "Compassionate",
        startDate: "2024-08-25",
        endDate: "2024-08-27",
        reason: "Family emergency.",
        status: "Approved",
        requestedDate: "2024-08-25",
        reviewedBy: "HR/Admin",
        reviewDate: "2024-08-25"
    },
     {
        id: 4,
        userId: 5,
        leaveType: "Annual",
        startDate: "2024-10-01",
        endDate: "2024-10-10",
        reason: "Planned trip.",
        status: "Pending",
        requestedDate: "2024-08-15"
    }
];

export const mockApplicants: Applicant[] = [
    { id: 1, jobId: 'JOB-001', name: 'John Doe', email: 'john.doe@example.com', phone: '077111222', appliedDate: '2024-08-01', status: 'Interview', resumeUrl: '#' },
    { id: 2, jobId: 'JOB-001', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '078222333', appliedDate: '2024-08-03', status: 'Screening' },
    { id: 3, jobId: 'JOB-002', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '079333444', appliedDate: '2024-08-05', status: 'Applied' },
    { id: 4, jobId: 'JOB-001', name: 'Emily White', email: 'emily.white@example.com', phone: '075444555', appliedDate: '2024-08-10', status: 'Offer' },
];

export const mockJobOpenings: JobOpening[] = [
    {
        id: 'JOB-001',
        title: 'Senior Sound Engineer',
        department: 'Operations',
        status: 'Open',
        postedDate: '2024-07-20',
        applicants: mockApplicants.filter(a => a.jobId === 'JOB-001'),
    },
    {
        id: 'JOB-002',
        title: 'HR Assistant',
        department: 'Human Resources',
        status: 'Open',
        postedDate: '2024-08-01',
        applicants: mockApplicants.filter(a => a.jobId === 'JOB-002'),
    },
    {
        id: 'JOB-003',
        title: 'Intern, Media & Communications',
        department: 'Media',
        status: 'Closed',
        postedDate: '2024-06-01',
        applicants: [],
    },
];

export const mockExitProcesses: ExitProcess[] = [
  {
    id: 1,
    userId: 6, // Ngota Steven
    exitDate: "2024-09-30",
    status: "Ongoing",
    clearance: [
      {
        department: "Store",
        status: "Cleared",
        items: [
          { id: "store-1", name: "Handover store keys", cleared: true },
          { id: "store-2", name: "Final stock-take report", cleared: true },
        ],
      },
      {
        department: "IT",
        status: "Cleared",
        items: [
          { id: "it-1", name: "Return company laptop & charger", cleared: true },
          { id: "it-2", name: "Disable system accounts", cleared: true },
        ],
      },
      {
        department: "HR",
        status: "In Progress",
        items: [
          { id: "hr-1", name: "Conduct exit interview", cleared: true },
          { id: "hr-2", name: "Sign final paperwork", cleared: false },
          { id: "hr-3", name: "Confirm final pay details", cleared: false },
        ],
      },
      {
        department: "Finance",
        status: "Pending",
        items: [
          { id: "fin-1", name: "Settle any outstanding advances", cleared: false },
          { id: "fin-2", name: "Process final payout", cleared: false },
        ],
      },
    ],
  },
];


export { mockFieldStaff } from './mock-field-staff';

    

    

    



