
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


const requisitionItemSchema = z.object({
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
    
