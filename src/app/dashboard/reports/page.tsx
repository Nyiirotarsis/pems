
"use client";
import React, { useState } from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { ReportsView } from "@/components/dashboard/reports-view";
import { 
    initialInventory, 
    mockQuotations, 
    mockLPOs, 
    mockInvoices, 
    mockPayments, 
    mockKpis, 
    mockAttendance,
    mockRequisitions 
} from "@/lib/mock-data";
import type { UserRole } from "@/types";

export default function ReportsPage() {
    const [role, setRole] = useState<UserRole | null>(null);

     React.useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as UserRole | null;
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    return (
        <PEMSDashboard initialRole={role}>
            <ReportsView 
                inventory={initialInventory}
                role={role}
                quotations={mockQuotations}
                lpos={mockLPOs}
                invoices={mockInvoices}
                payments={mockPayments}
                kpis={mockKpis}
                attendance={mockAttendance}
                requisitions={mockRequisitions}
            />
        </PEMSDashboard>
    );
}
