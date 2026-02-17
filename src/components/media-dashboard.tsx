
"use client";

import {
  Rss,
  Image,
  Newspaper,
  Calendar,
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
    title: "Social Media",
    icon: Rss,
    description: "Schedule posts and monitor social channels.",
    href: "#",
  },
  {
    title: "Media Gallery",
    icon: Image,
    description: "Manage event photos and videos.",
    href: "/dashboard/album-show",
  },
  {
    title: "Press Releases",
    icon: Newspaper,
    description: "Draft and distribute press releases.",
    href: "#",
  },
  {
    title: "Content Calendar",
    icon: Calendar,
    description: "Plan and visualize your content strategy.",
    href: "/dashboard/media/calendar",
  },
];

export default function MediaDashboard() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Media & Communication Dashboard</CardTitle>
          <CardDescription>
            Manage all public relations and media content from here.
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
