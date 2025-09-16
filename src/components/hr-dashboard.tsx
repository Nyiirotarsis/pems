
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  CalendarOff,
  DollarSign,
  UserPlus,
  Building,
  UserCheck,
  UserMinus,
  FileBarChart,
  Briefcase,
  Bell,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Visitor } from "@/types";
import { format } from "date-fns";

type HrDashboardProps = {
    visitors: Visitor[];
}

export default function HrDashboard({ visitors }: HrDashboardProps) {
  const router = useRouter();

  const kpiCards = [
    {
      title: "Total Staff",
      value: "52",
      icon: Users,
      description: "All employees, full-time and casual",
    },
    {
      title: "Active Visitors Today",
      value: visitors.length.toString(),
      icon: UserCheck,
      description: "Visitors currently on-site",
    },
    {
      title: "Leave Requests Pending",
      value: "3",
      icon: CalendarOff,
      description: "Awaiting approval",
    },
    {
      title: "Payroll This Month",
      value: "UGX 85M",
      icon: DollarSign,
      description: "Total gross payroll processed",
    },
  ];

  const quickActions = [
    { title: "Register Visitor", icon: UserPlus, href: "/dashboard/hr/visitors" },
    { title: "Run Payroll", icon: DollarSign, href: "/dashboard/hr/payroll" },
    { title: "Approve Leave", icon: UserCheck, href: "/dashboard/hr/leave" },
    { title: "Post Job Advert", icon: Briefcase, href: "/dashboard/hr/recruitment" },
  ];
  
  const recentVisitors = visitors.slice(0, 3);
  const visitorAlerts = visitors.slice(0, 2);

  return (
    <div className="grid gap-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
             {/* Quick Actions */}
            <Card>
                <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                    <Button key={index} variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push(action.href)}>
                        <action.icon className="h-6 w-6" />
                        <span className="text-center">{action.title}</span>
                    </Button>
                ))}
                </CardContent>
            </Card>

             {/* Recent Visitors & Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Alerts</CardTitle>
                        <CardDescription>Recent visitor arrivals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {visitorAlerts.map((visitor) => (
                                <div key={visitor.id} className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium leading-none">{visitor.name} arrived for {visitor.reason}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(visitor.timeIn), 'HH:mm')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Visitors</CardTitle>
                        <CardDescription>A log of who visited whom.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {recentVisitors.map((visitor) => (
                                <div key={visitor.id} className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{visitor.name}</p>
                                    <p className="text-sm text-muted-foreground">{visitor.personVisiting}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Placeholder for other modules */}
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Other HR activities will be shown here...</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
