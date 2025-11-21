
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import { FinanceModule } from "@/components/finance-module";

export default function FinanceDashboardPage() {
  return (
    <PEMSDashboard initialRole="Finance Manager">
        <FinanceModule />
    </PEMSDashboard>
  );
}
