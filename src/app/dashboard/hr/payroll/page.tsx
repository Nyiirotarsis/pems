
"use client";
import PEMSDashboard from "@/components/pems-dashboard";

export default function PayrollDashboardPage() {
  return (
    <PEMSDashboard initialRole="HR/Admin">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-4">Payroll & Per Diem Dashboard</h1>
        <p className="text-muted-foreground">
          This dashboard will contain summaries, charts, and reports for both salary and per diem payments. This is under construction.
        </p>
      </div>
    </PEMSDashboard>
  );
}
