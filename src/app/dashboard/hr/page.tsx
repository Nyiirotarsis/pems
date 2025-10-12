
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import HrDashboard from "@/components/hr-dashboard";
import { mockVisitors } from "@/lib/mock-data";

export default function HRDashboardPage() {
  return (
    <PEMSDashboard initialRole="HR/Admin">
      <HrDashboard visitors={mockVisitors} />
    </PEMSDashboard>
  );
}
