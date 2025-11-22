
"use client";

import {
  BarChart,
  BotMessageSquare,
  Camera,
  FileText,
  Megaphone,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent
} from "./ui/card";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const moduleCards = [
  {
    title: "Content & Publishing",
    icon: FileText,
    description: "Create, schedule, and publish posts.",
    href: "/dashboard/media/content",
  },
  {
    title: "Media Library",
    icon: Camera,
    description: "Manage and archive all digital assets.",
    href: "/dashboard/media/library",
  },
  {
    title: "Campaigns",
    icon: Megaphone,
    description: "Create and monitor marketing campaigns.",
    href: "/dashboard/media/campaigns",
  },
  {
    title: "Reports & Analytics",
    icon: BarChart,
    description: "View social media and campaign performance.",
    href: "/dashboard/reports",
  },
];

export default function MediaDashboard() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Media & Communications Dashboard</CardTitle>
          <CardDescription>
            Manage public image, brand visibility, and communication channels.
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
                disabled
              >
                Go to Module
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
