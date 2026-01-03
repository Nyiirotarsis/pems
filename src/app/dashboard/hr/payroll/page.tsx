
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, Landmark, Printer, Users } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { mockFieldPaymentRequests, mockPayrollData } from "@/lib/mock-data";
import PEMSDashboard from "@/components/pems-dashboard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PayrollDashboardPage() {
  const router = useRouter();

  const totalSalary = mockPayrollData.reduce((acc, rec) => acc + rec.basicPay + rec.otherBenefits, 0);
  const totalPerDiem = mockFieldPaymentRequests.reduce((acc, req) => acc + req.totalAmount, 0);
  const totalDeductions = mockPayrollData.reduce((acc, rec) => {
      const grossPay = rec.basicPay + rec.otherBenefits;
      const nssf5 = grossPay * 0.05;
      const paye = grossPay > 410000 ? (grossPay - 410000) * 0.3 + 35500 : 0;
      const lst = grossPay > 300000 ? 5000 : 0;
      return acc + nssf5 + paye + lst + rec.salaryAdvance;
  }, 0);


  const kpiCards = [
    { title: "Total Monthly Salary (Gross)", value: `UGX ${totalSalary.toLocaleString()}`, icon: DollarSign },
    { title: "Total Per Diem (This Month)", value: `UGX ${totalPerDiem.toLocaleString()}`, icon: Users },
    { title: "Total Statutory Deductions", value: `UGX ${totalDeductions.toLocaleString()}`, icon: Landmark },
  ];

  const paymentDistributionData = [
    { name: "Net Salary", value: totalSalary - totalDeductions },
    { name: "Per Diem", value: totalPerDiem },
  ];
  
  const deductionBreakdownData = [
      { name: "PAYE", value: totalDeductions - mockPayrollData.reduce((acc, rec) => acc + (rec.basicPay * 0.05), 0) }, // simplified
      { name: "NSSF 5%", value: mockPayrollData.reduce((acc, rec) => acc + (rec.basicPay * 0.05), 0) },
  ];

  return (
    <PEMSDashboard initialRole="HR/Admin">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Payroll & Per Diem Dashboard</CardTitle>
            <CardDescription>
              An overview of staff compensation, including salaries and event-based payments.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kpiCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Distribution</CardTitle>
                    <CardDescription>Breakdown of Net Salary vs. Per Diem payments.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="min-h-[250px] w-full">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent />} />
                            <Pie data={paymentDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {paymentDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Deduction Types</CardTitle>
                    <CardDescription>A summary of total statutory deductions.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="min-h-[250px] w-full">
                        <BarChart data={deductionBreakdownData} layout="vertical" margin={{ left: 20 }}>
                           <CartesianGrid horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" radius={5}>
                                {deductionBreakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        
        {/* Navigation & Reporting */}
        <Card>
            <CardHeader>
                <CardTitle>Modules & Reports</CardTitle>
                <CardDescription>Access detailed lists or generate payment reports.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push('/dashboard/hr/payroll/salary')}>
                    <FileText className="h-6 w-6" />
                    Salary List
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push('/dashboard/hr/payroll/per-diem')}>
                    <FileText className="h-6 w-6" />
                    Per Diem List
                </Button>
                 <Button variant="secondary" className="h-20 flex-col gap-2">
                    <Printer className="h-6 w-6" />
                    Print Salary EFT Report
                </Button>
                 <Button variant="secondary" className="h-20 flex-col gap-2">
                    <Printer className="h-6 w-6" />
                    Print Per Diem EFT Report
                </Button>
            </CardContent>
        </Card>
      </div>
    </PEMSDashboard>
  );
}
