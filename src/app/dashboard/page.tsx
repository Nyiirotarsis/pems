
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { UserRole } from "@/types";
import { ROLES } from "@/lib/mock-data";

// This page acts as a router to the correct default dashboard for the user's role.
export default function DashboardPage() {
  const router = useRouter();

  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;

    if (storedRole && ROLES.includes(storedRole)) {
      switch (storedRole) {
        case "CEO":
        case "Director":
          router.replace("/dashboard/director");
          break;
        case "Finance Manager":
          router.replace("/dashboard/finance");
          break;
        case "HR/Admin":
          router.replace("/dashboard/hr");
          break;
        case "IT Managers":
          router.replace("/dashboard/it");
          break;
        case "Store Manager":
          router.replace("/dashboard/store");
          break;
        case "Field Operational Officer":
          router.replace("/dashboard/field-ops");
          break;
        case "Media & Communications Officer":
            router.replace("/dashboard/media");
            break;
        default:
          // Fallback for any other valid role, perhaps to a generic dashboard
          router.replace("/dashboard/director");
          break;
      }
    } else {
      // If no role is found or the role is invalid, go back to login
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="ml-2">Loading your dashboard...</p>
    </div>
  );
}
