
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import DirectorDashboard from "@/components/director-dashboard";

export default function CEODashboardPage() {
  return (
    <PEMSDashboard initialRole="CEO">
      <DirectorDashboard />
    </PEMSDashboard>
  );
}
