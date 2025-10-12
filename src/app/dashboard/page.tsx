
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { UserRole } from "@/types";
import { ROLES } from "@/lib/mock-data";

import PEMSDashboard from "@/components/pems-dashboard";
import DirectorDashboard from "@/components/director-dashboard";
import HrDashboard from "@/components/hr-dashboard";
import { FinanceModule } from "@/components/finance-module";
import ITDashboard from "@/components/it-dashboard";
import { InventoryView } from "@/components/dashboard/inventory-view";
import { mockVisitors, initialInventory } from "@/lib/mock-data";


// This page acts as a router to the correct default dashboard for the user's role.
export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  // This state is only for views that need it, like InventoryView
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (!storedRole || !ROLES.includes(storedRole)) {
      router.push("/login");
    } else {
      setRole(storedRole);
      setLoading(false);
    }
  }, [router]);

  if (loading || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (role) {
        case "CEO":
        case "Director":
            return <DirectorDashboard />;
        case "HR/Admin":
            return <HrDashboard visitors={mockVisitors} />;
        case "Finance Manager":
            return <FinanceModule role={role} />;
        case "IT Managers":
            return <ITDashboard />;
        case "Store Manager":
             const getInventoryTotals = (item: any) => {
                const total = item.assets.length;
                const available = item.assets.filter((a: any) => a.status === 'Available' && a.condition === 'Good').length;
                return { total, available };
            };
            const inventoryWithTotals = initialInventory.map(item => ({
                ...item,
                ...getInventoryTotals(item)
            }));
            const filteredInventory = inventoryWithTotals.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return (
              <InventoryView 
                inventory={filteredInventory} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                onRestock={() => {}} 
              />
            );
        default:
            return <div>Welcome!</div>;
    }
  };

  return (
    <PEMSDashboard initialRole={role}>
        {renderDashboardContent()}
    </PEMSDashboard>
  )
}
