
"use client";
import * as React from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { FinanceModule } from "@/components/finance-module";
import type { UserRole } from "@/types";

export default function FinanceDashboardPage() {
  const [role, setRole] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <PEMSDashboard initialRole="Finance Manager">
        <FinanceModule role={role} />
    </PEMSDashboard>
  );
}
