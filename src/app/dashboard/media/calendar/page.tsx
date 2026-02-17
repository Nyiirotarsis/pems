
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import PEMSDashboard from "@/components/pems-dashboard";

export default function ContentCalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <PEMSDashboard initialRole="Media and Communication Officer">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Content Calendar
            </CardTitle>
            <CardDescription>
              Plan and visualize your content schedule across all platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </PEMSDashboard>
  );
}
