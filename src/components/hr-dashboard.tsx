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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const kpiCards = [
  {
    title: "Total Staff",
    value: "52",
    icon: Users,
    description: "All employees, full-time and casual",
  },
  {
    title: "Active Contracts",
    value: "45",
    icon: FileText,
    description: "Currently active employment contracts",
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
  { title: "Add New Employee", icon: UserPlus, href: "/dashboard/hr/employees" },
  { title: "Run Payroll", icon: DollarSign, href: "/dashboard/hr/payroll" },
  { title: "Approve Leave", icon: UserCheck, href: "/dashboard/hr/leave" },
  { title: "Post Job Advert", icon: Briefcase, href: "/dashboard/hr/recruitment" },
  { title: "Capture Attendance", icon: CalendarOff, href: "/dashboard/attendance" },
];

const moduleShortcuts = [
  { title: "Payroll", icon: DollarSign, href: "/dashboard/hr/payroll" },
  { title: "Leave Management", icon: CalendarOff, href: "/dashboard/hr/leave" },
  { title: "Recruitment", icon: Briefcase, href: "/dashboard/hr/recruitment" },
  { title: "Attendance", icon: UserCheck, href: "/dashboard/attendance" },
  { title: "Employee Records", icon: Users, href: "/dashboard/hr/employees" },
  { title: "Exit Process", icon: UserMinus, href: "/dashboard/hr/exit" },
];

const recentActivity = [
    { text: "Payroll for August processed", date: "02-Sep-25" },
    { text: "Leave request: John Okello → Pending", date: "01-Sep-25" },
    { text: "Job advert: Event Manager role posted", date: "01-Sep-25" },
    { text: "3 employees checked in late", date: "today" },
];


export default function HrDashboard() {
  const router = useRouter();
  
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
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                    <Button key={index} variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push(action.href)}>
                        <action.icon className="h-6 w-6" />
                        <span>{action.title}</span>
                    </Button>
                ))}
                </CardContent>
            </Card>

            {/* Module Shortcuts */}
            <Card>
                <CardHeader>
                <CardTitle>Module Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {moduleShortcuts.map((shortcut, index) => (
                    <Button key={index} variant="secondary" size="lg" className="h-24 flex-col gap-2" onClick={() => router.push(shortcut.href)}>
                        <shortcut.icon className="h-8 w-8" />
                        <span>{shortcut.title}</span>
                    </Button>
                ))}
                </CardContent>
            </Card>
        </div>

        {/* Recent Activity */}
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback>{activity.text.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium leading-none">{activity.text}</p>
                                <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
