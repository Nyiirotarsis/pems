
"use client";

import {
  ShieldCheck,
  Users,
  BarChart,
  BookOpen,
  FileText,
  Recycle,
  HeartHandshake,
  TrendingUp,
  Search,
  Briefcase,
  Leaf,
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
    title: "Governance & Policy",
    icon: BookOpen,
    description: "Access sustainability policies, plans, and legal registers.",
    href: "/dashboard/sustainability/governance",
  },
  {
    title: "Stakeholders",
    icon: HeartHandshake,
    description: "Manage stakeholder engagement and requirements.",
    href: "/dashboard/sustainability/stakeholders",
  },
  {
    title: "Impacts, Risks & Opportunities",
    icon: BarChart,
    description: "Assess impacts and manage risks with control measures.",
    href: "/dashboard/sustainability/risks",
  },
  {
    title: "Event Sustainability",
    icon: Leaf,
    description: "Access checklists, reports, and lessons learned for events.",
    href: "/dashboard/sustainability/events",
  },
    {
    title: "Suppliers & Procurement",
    icon: Briefcase,
    description: "Track supplier sustainability and local sourcing.",
    href: "/dashboard/sustainability/procurement",
  },
  {
    title: "Resources & Waste",
    icon: Recycle,
    description: "Monitor material usage, reuse, and waste disposal.",
    href: "/dashboard/sustainability/resources",
  },
  {
    title: "People, Health & Safety",
    icon: Users,
    description: "Manage training, H&S risks, and accessibility.",
    href: "/dashboard/sustainability/people",
  },
  {
    title: "Performance & Improvement",
    icon: TrendingUp,
    description: "Track KPIs, nonconformities, and corrective actions.",
    href: "/dashboard/sustainability/performance",
  },
  {
    title: "Audit & Management Review",
    icon: Search,
    description: "Access internal audits and management review records.",
    href: "/dashboard/sustainability/audits",
  },
];

export default function SustainabilityDashboard() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            Sustainability (ESMS) Dashboard
          </CardTitle>
          <CardDescription>
            An overview of the Event Sustainability Management System.
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
                disabled={card.href === "#"}
              >
                Go to Module
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
