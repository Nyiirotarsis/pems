
"use client";

import {
  Activity,
  BotMessageSquare,
  CheckSquare,
  FileText,
  Fuel,
  Users,
  QrCode,
  ArrowRightLeft,
  PackagePlus,
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
    title: "Fuel & Logistics",
    icon: Fuel,
    description: "Request fuel, transport, and manage mileage.",
    href: "/dashboard/field-ops/logistics",
  },
  {
    title: "Equipment Requisition",
    icon: FileText,
    description: "Create and submit a list of required items for an event.",
    href: "/dashboard/field-ops/requisition",
  },
  {
    title: "Post-Event Equipment Returns",
    icon: ArrowRightLeft,
    description: "Issue return logic, evaluate on-site conditions, and reverse logistics.",
    href: "/dashboard/field-ops/returns",
  },
  {
    title: "Manage Crew",
    icon: Users,
    description: "Oversee on-site personnel and their assignments.",
    href: "/dashboard/field-ops/crew",
  },
  {
    title: "Site Attendance",
    icon: QrCode,
    description: "Generate QR codes and manage worker attendance.",
    href: "/dashboard/field-ops/attendance",
  },
];

export default function FieldOpsDashboard() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Field Operational Officer Dashboard</CardTitle>
          <CardDescription>
            Manage on-site activities, make requests, and approve tasks.
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
