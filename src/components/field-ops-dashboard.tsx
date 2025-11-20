
"use client";

import {
  Activity,
  BotMessageSquare,
  CheckSquare,
  FileText,
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
    title: "Oversee Site Activities",
    icon: Activity,
    description: "Monitor and manage ongoing on-site operations.",
    href: "/dashboard/field-ops/activities",
  },
  {
    title: "Make Store Request",
    icon: BotMessageSquare,
    description: "Request equipment and materials from the store.",
    href: "/dashboard/field-ops/requests",
  },
  {
    title: "Approve Tasks",
    icon: CheckSquare,
    description: "Review and approve completed tasks from field staff.",
    href: "/dashboard/field-ops/approvals",
  },
  {
    title: "View Reports",
    icon: FileText,
    description: "Access reports related to field operations.",
    href: "/dashboard/reports",
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
