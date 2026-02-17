
import { z } from "zod";
import { format } from "date-fns";

import { kpiFormSchema, attendanceFormSchema, fieldPaymentRequestSchema } from "./schemas";
import type { Kpi, AttendanceRecord, FieldPaymentRequest, FieldPaymentStatus, KpiStatus } from "@/types";
import { USERS, mockFieldStaff } from "./mock-data";


export function addKpi(kpis: Kpi[], values: z.infer<typeof kpiFormSchema>): { newKpi?: Kpi, error?: string } {
    const newKpi: Kpi = {
        id: Date.now(),
        userId: parseInt(values.userId),
        ...values,
        startDate: format(values.startDate, "yyyy-MM-dd"),
        endDate: format(values.endDate, "yyyy-MM-dd"),
        status: 'Pending',
    };
    return { newKpi };
}

export function completeKpi(kpis: Kpi[], kpiId: number): { updatedKpis: Kpi[], error?: string } {
    let kpiFound = false;
    const updatedKpis = kpis.map(kpi => {
        if (kpi.id === kpiId) {
            kpiFound = true;
            return { ...kpi, status: 'Completed' as KpiStatus, finishedDate: format(new Date(), "yyyy-MM-dd") };
        }
        return kpi;
    });

    if (!kpiFound) {
        return { updatedKpis: kpis, error: "KPI not found." };
    }
    return { updatedKpis };
}


export function addAttendanceRecord(attendance: AttendanceRecord[], values: z.infer<typeof attendanceFormSchema>): { newRecord?: AttendanceRecord, error?: string } {
    const newRecord: AttendanceRecord = {
        id: Date.now(),
        userId: parseInt(values.userId),
        date: format(values.date, "yyyy-MM-dd"),
        status: values.status,
        notes: values.notes,
    };
    return { newRecord };
}


export function addFieldPaymentRequest(fieldPayments: FieldPaymentRequest[], values: z.infer<typeof fieldPaymentRequestSchema>): { newRequest?: FieldPaymentRequest, error?: string } {
    const staffMember = mockFieldStaff.find(s => s.id === parseInt(values.staffId));
    if (!staffMember) {
        return { error: "Selected staff member not found." };
    }

    const newRequest: FieldPaymentRequest = {
        id: fieldPayments.length + 1,
        staffId: parseInt(values.staffId),
        staffName: staffMember.name,
        workDescription: values.workDescription,
        daysWorked: values.daysWorked,
        rate: values.rate,
        totalAmount: values.daysWorked * values.rate,
        status: 'Pending',
        requestDate: format(values.requestDate, "yyyy-MM-dd"),
    };
    
    return { newRequest };
}


export function updateFieldPaymentStatus(fieldPayments: FieldPaymentRequest[], id: number, status: FieldPaymentStatus): { updatedPayments: FieldPaymentRequest[], updatedPayment?: FieldPaymentRequest, error?: string } {
    let updatedPayment: FieldPaymentRequest | undefined;
    const updatedPayments = fieldPayments.map(p => {
        if (p.id === id) {
            const payment: FieldPaymentRequest = { ...p, status };
            if (status === 'Paid') {
                payment.paymentDate = format(new Date(), "yyyy-MM-dd");
            }
            if (status === 'Acknowledged') {
                payment.receiptFile = 'receipt_placeholder.pdf';
            }
            updatedPayment = payment;
            return payment;
        }
        return p;
    });

    if (!updatedPayment) {
        return { updatedPayments: fieldPayments, error: "Payment request not found." };
    }

    return { updatedPayments, updatedPayment };
}
