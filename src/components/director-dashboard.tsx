
"use client";

import {
  BarChart,
  DollarSign,
  Package,
  Shield,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { UserRole } from "@/types";

const moduleCards = [
  {
    title: "Store & Operations",
    icon: Package,
    description: "Manage inventory, assets, and transactions.",
    href: "/dashboard/store",
  },
  {
    title: "Finance & Accounts",
    icon: DollarSign,
    description: "Oversee quotations, LPOs, invoices, and payments.",
    href: "/dashboard/finance",
  },
  {
    title: "Human Resources",
    icon: Users,
    description: "Manage employees, payroll, leave, and recruitment.",
    href: "/dashboard/hr",
  },
  {
    title: "IT & Security",
    icon: Shield,
    description: "Monitor systems, security, and user access.",
    href: "/dashboard/it",
  },
  {
    title: "Reports & Analytics",
    icon: BarChart,
    description: "View comprehensive reports across all modules.",
    href: "/dashboard/reports",
  },
];

export default function DirectorDashboard({ role }: { role: UserRole }) {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{role} Dashboard</CardTitle>
          <CardDescription>
            High-level overview of all business operations. Select a module to
            view its detailed dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {moduleCards.map((card, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <card.icon className="h-8 w-8 text-muted-foreground" />
                <CardTitle>{card.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <Button
                variant="ghost"
                className="justify-self-end m-4 mt-auto"
                onClick={() => router.push(card.href)}
              >
                Go to Module
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
