"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import StoreDashboard from "@/components/store-dashboard";

export default function StoreDashboardPage() {
  return (
    <PEMSDashboard initialRole="Store Manager">
      <StoreDashboard />
    </PEMSDashboard>
  );
}
