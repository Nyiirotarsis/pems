
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
    title: "Manage Equipments at Site",
    icon: ArrowRightLeft,
    description: "Issue and return equipment for events.",
    href: "/dashboard/store/transactions",
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
