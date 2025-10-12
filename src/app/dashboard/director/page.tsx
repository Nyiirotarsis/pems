
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import DirectorDashboard from "@/components/director-dashboard";

export default function DirectorDashboardPage() {
  return (
    <PEMSDashboard initialRole="Director">
      <DirectorDashboard />
    </PEMSDashboard>
  );
}
