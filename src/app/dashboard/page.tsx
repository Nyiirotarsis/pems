
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { UserRole } from "@/types";
import { ROLES } from "@/lib/mock-data";

// This page acts as a router to the correct default dashboard for the user's role.
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (!storedRole || !ROLES.includes(storedRole)) {
      router.push("/login");
      return;
    }

    switch (storedRole) {
      case "CEO":
      case "Director":
        // Directors see a special top-level dashboard
        router.push("/dashboard/director");
        break;
      case "Finance Manager":
        router.push("/dashboard/finance");
        break;
      case "HR/Admin":
        router.push("/dashboard/hr");
        break;
      case "IT Managers":
        router.push("/dashboard/it");
        break;
      case "Store Manager":
        router.push("/dashboard/store");
        break;
      default:
        router.push("/login");
        break;
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
