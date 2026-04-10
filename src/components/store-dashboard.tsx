"use client";

import {
  Package,
  Wrench,
  ArrowRightLeft,
  ClipboardList
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

const moduleCards = [
  {
    title: "Inventory Asset Management",
    icon: Package,
    description: "Track all company equipment, update conditions, and manage global stock.",
    href: "/dashboard/assets",
  },
  {
    title: "Equipment Requests Inbox",
    icon: ClipboardList,
    description: "Receive, review, and confirm equipment requisitions from Field Ops.",
    href: "/dashboard/store/requests",
  },
  {
    title: "Asset Check-In / Check-Out",
    icon: ArrowRightLeft,
    description: "Log equipment transactions exactly as they leave or enter the warehouse.",
    href: "/dashboard/store/transactions",
  },
  {
    title: "Maintenance Logs",
    icon: Wrench,
    description: "Track faulty and repaired equipment status with external technicians.",
    href: "/dashboard/store/maintenance",
  },
];

export default function StoreDashboard() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Manager Dashboard</CardTitle>
          <CardDescription>
            Oversee inventory, manage asset conditions, and fulfill field operations requests.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {moduleCards.map((card, index) => (
          <Card key={index} className="flex flex-col border border-border hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <card.icon className="h-8 w-8 text-primary" />
                <CardTitle>{card.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <Button
                variant="ghost"
                className="justify-self-end m-4 mt-auto group"
                onClick={() => router.push(card.href)}
              >
                Go to Module <ArrowRightLeft className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
