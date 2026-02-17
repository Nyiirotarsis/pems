
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import AdminDashboard from "@/components/admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <PEMSDashboard initialRole="Admin">
      <AdminDashboard />
    </PEMSDashboard>
  );
}
