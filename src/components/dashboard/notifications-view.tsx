"use client";

import { Bell, Check } from "lucide-react";
import { format } from "date-fns";
import type { AppNotification } from "@/types";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type NotificationsViewProps = {
  notifications: AppNotification[];
  onMarkAsRead: (id: number) => void;
};

export function NotificationsView({
  notifications,
  onMarkAsRead,
}: NotificationsViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Notifications</CardTitle>
        <CardDescription>Recent alerts and updates.</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Bell className="mx-auto h-12 w-12" />
            <p className="mt-4">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border",
                  n.read ? "bg-secondary/50" : "bg-card"
                )}
              >
                <div className="flex-1">
                  <p className={cn("text-sm", !n.read && "font-semibold")}>
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(n.date), "PPP p")}
                  </p>
                </div>
                {!n.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(n.id)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
