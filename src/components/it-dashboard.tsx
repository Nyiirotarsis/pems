
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  Power,
  DatabaseZap,
  UserPlus,
  ShieldAlert,
  ListRestart,
  FileClock,
  CheckCircle2,
  FileText,
  FileDown
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const kpiCards = [
  {
    title: "Active Users",
    value: "58",
    icon: Users,
    description: "Users logged in today",
  },
  {
    title: "System Uptime",
    value: "99.8%",
    icon: Power,
    description: "Last 24 hours",
  },
  {
    title: "Security Alerts",
    value: "2",
    icon: ShieldAlert,
    description: "Require immediate attention",
  },
  {
    title: "Last Backup",
    value: "Today, 03:00",
    icon: DatabaseZap,
    description: "Successful cloud backup",
  },
];

const quickActions = [
  { title: "Add User / Role", icon: UserPlus, href: "/dashboard/it/users" },
  { title: "Run Security Scan", icon: ShieldCheck, href: "/dashboard/it/security" },
  { title: "Review Logs", icon: FileClock, href: "/dashboard/it/security" },
  { title: "Trigger Backup", icon: ListRestart, href: "/dashboard/it/systems" },
];

const frameworks = [
    { title: "NIST Cybersecurity Framework", items: ["Identify", "Protect", "Detect", "Respond", "Recover"] },
    { title: "ISO/IEC 27001 Controls", items: ["Access control", "Risk mgmt", "Compliance"] },
    { title: "CIS Controls (18 Security Steps)", items: ["Secure configs", "Patching", "Monitoring"] },
    { title: "COBIT 2019 Governance", items: ["IT aligned with business goals"] },
    { title: "Incident Response Workflow", items: ["Alerts", "Escalation", "Forensics", "Reports"] },
];

const systemStatus = [
    { title: "Recent Incident", value: "Suspicious login blocked", status: "High" as const },
    { title: "Last Scan", value: "No critical vulnerabilities", status: "Clear" as const },
    { title: "Audit Trail", value: "120 events logged today", status: "Nominal" as const },
];

const statusColors = {
    High: "text-red-500",
    Clear: "text-green-500",
    Nominal: "text-muted-foreground",
}

export default function ITDashboard() {
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
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button key={index} variant="outline" className="h-24 flex-col gap-2" onClick={() => router.push(action.href)}>
                  <action.icon className="h-6 w-6" />
                  <span className="text-center">{action.title}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Cybersecurity Frameworks */}
           <Card>
            <CardHeader>
              <CardTitle>Cybersecurity Frameworks Compliance</CardTitle>
              <CardDescription>Tracking adherence to key security standards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {frameworks.map((framework, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">{framework.title}</p>
                    <div className="flex flex-wrap gap-x-2">
                        {framework.items.map((item, itemIndex) => (
                             <Badge key={itemIndex} variant="secondary" className="font-normal">{item}</Badge>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 grid grid-cols-1 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemStatus.map((status, index) => (
                  <div key={index}>
                    <p className="text-sm font-medium">{status.title}</p>
                    <p className={cn("text-sm", statusColors[status.status])}>
                      {status.value}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reporting */}
            <Card>
                <CardHeader>
                    <CardTitle>Reporting</CardTitle>
                    <CardDescription>Generate and export system reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                   <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4" />
                        Generate Compliance Report
                    </Button>
                     <Button variant="outline" className="w-full justify-start gap-2">
                        <FileDown className="h-4 w-4" />
                        Export System Logs
                    </Button>
                     <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4" />
                        Monthly IT Performance
                    </Button>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
