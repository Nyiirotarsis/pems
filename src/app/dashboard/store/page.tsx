
"use client";
import StoreManagerDashboard from "@/components/store-manager-dashboard";
import PEMSDashboard from "@/components/pems-dashboard";

export default function StoreDashboardPage() {
  return (
    <PEMSDashboard initialRole="Store Manager">
      <StoreManagerDashboard />
    </PEMSDashboard>
  );
}
