
import { z } from "zod";

export const transactionFormSchema = z.object({
  equipmentId: z.string().min(1, "Please select an equipment."),
  date: z.date(),
  condition: z.string().optional(),
  assetIds: z.array(z.string()).min(1, "Please select at least one asset."),
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
