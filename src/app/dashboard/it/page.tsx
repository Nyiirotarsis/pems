
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import ITDashboard from "@/components/it-dashboard";

export default function ITDashboardPage() {
  return (
    <PEMSDashboard initialRole="IT Managers">
      <ITDashboard />
    </PEMSDashboard>
  );
}
