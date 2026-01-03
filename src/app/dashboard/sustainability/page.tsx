
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import SustainabilityDashboard from "@/components/sustainability-dashboard";

export default function SustainabilityPage() {
  return (
    <PEMSDashboard initialRole={null}>
      <SustainabilityDashboard />
    </PEMSDashboard>
  );
}
