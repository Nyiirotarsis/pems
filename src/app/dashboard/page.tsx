
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
    let storedRole: UserRole | null = null;
    let attempts = 0;

    const interval = setInterval(() => {
      attempts++;
      storedRole = localStorage.getItem("userRole") as UserRole | null;

      if (storedRole && ROLES.includes(storedRole)) {
        clearInterval(interval);
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
          default:
            router.replace("/login");
            break;
        }
      } else if (attempts > 10) { // After 1 second, give up and go to login
        clearInterval(interval);
        router.replace("/login");
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
