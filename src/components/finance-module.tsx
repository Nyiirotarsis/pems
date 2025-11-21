
"use client";

import {
  FileText,
  Landmark,
  Receipt,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const moduleCards = [
  {
    title: "Quotations",
    icon: FileText,
    description: "Create and manage client quotations.",
    href: "/dashboard/finance/quotations",
  },
  {
    title: "Local Purchase Orders",
    icon: Landmark,
    description: "Issue and track LPOs from approved quotes.",
    href: "/dashboard/finance/lpos",
  },
  {
    title: "Invoices",
    icon: Receipt,
    description: "Capture and manage client invoices.",
    href: "/dashboard/finance/invoices",
  },
  {
    title: "Payments",
    icon: DollarSign,
    description: "Record and track incoming payments.",
    href: "/dashboard/finance/payments",
  },
];

export function FinanceModule() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Finance Dashboard</CardTitle>
          <CardDescription>
            Manage all financial operations from one place. Select a module to begin.
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
