
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import FieldOpsDashboard from "@/components/field-ops-dashboard";

export default function FieldOpsDashboardPage() {
  return (
    <PEMSDashboard initialRole="Field Operational Officer">
      <FieldOpsDashboard />
    </PEMSDashboard>
  );
}
