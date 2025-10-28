
"use client";
import React from "react";
import {
  Warehouse,
  Package,
  PackagePlus,
  PackageSearch,
  PieChartIcon,
  FileText,
  Landmark,
  UserCheck,
  ClipboardCheck,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  BarChart as RechartsBarChart,
} from "recharts";
import {
  format,
  isWithinInterval,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  isToday,
} from "date-fns";

import type { InventoryItem, ReportsViewProps, FinancialStatus, AttendanceStatus, KpiStatus } from "@/types";
import { assetCategories } from "@/lib/mock-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "../ui/button";

type TimeFilter = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export function ReportsView({
  inventory,
  role,
  quotations,
  lpos,
  invoices,
  payments,
  kpis,
  attendance,
}: ReportsViewProps) {
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>("monthly");

  const getInventoryTotals = (item: InventoryItem) => {
    const total = item.quantityAvailable + (item.status === 'Out' || item.status === 'Under Repair' ? 1 : 0); // Simplified total
    const available = item.status === "Available" ? item.quantityAvailable : 0;
    const issued = item.status === "Out" ? item.quantityAvailable : 0; // Assuming quantityAvailable represents issued when status is 'Out'
    const faulty = item.condition === "Faulty" || item.status === "Under Repair" ? item.quantityAvailable : 0;
    return { total, available, issued, faulty };
  };

  const inventoryWithTotals = inventory.map((item) => ({
    ...item,
    ...getInventoryTotals(item),
  }));

  const totalItems = inventoryWithTotals.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const totalAvailable = inventoryWithTotals.reduce(
    (sum, item) => sum + item.available,
    0
  );
  const mostStocked = inventoryWithTotals.reduce(
    (max, item) => (item.total > max.total ? item : max),
    inventoryWithTotals[0] || { itemName: "N/A", total: 0 }
  );
  const leastAvailable = inventoryWithTotals.reduce(
    (min, item) => (item.available < min.available ? item : min),
    inventoryWithTotals[0] || { itemName: "N/A", available: 0 }
  );

  const categoryTotals = assetCategories
    .map((category) => {
      const total = inventory
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.quantityAvailable, 0);
      return { name: category, value: total };
    })
    .filter((c) => c.value > 0);

  // Financial chart data filtering
  const now = new Date();
  const dateRanges: Record<TimeFilter, Interval> = {
    daily: { start: subDays(now, 1), end: now },
    weekly: { start: startOfWeek(now), end: endOfWeek(now) },
    monthly: { start: startOfMonth(now), end: endOfMonth(now) },
    quarterly: { start: startOfQuarter(now), end: endOfQuarter(now) },
    yearly: { start: startOfYear(now), end: endOfYear(now) },
  };
  const selectedInterval = dateRanges[timeFilter];

  const filteredQuotations = quotations.filter((q) =>
    isWithinInterval(new Date(q.date), selectedInterval)
  );
  const filteredLPOs = lpos.filter((l) =>
    isWithinInterval(new Date(l.date), selectedInterval)
  );
  const filteredInvoices = invoices.filter((i) =>
    isWithinInterval(new Date(i.date), selectedInterval)
  );
  const filteredPayments = payments.filter((p) =>
    isWithinInterval(new Date(p.date), selectedInterval)
  );

  const quotationStatusData = (
    ["Approved", "Rejected", "Pending"] as FinancialStatus[]
  )
    .map((status) => ({
      name: status,
      value: filteredQuotations.filter((q) => q.status === status).length,
    }))
    .filter((d) => d.value > 0);

  const lpoStatusData = (["Delivered", "Pending"] as const).map((status) => ({
    name: status,
    count: filteredLPOs.filter((l) => l.status === status).length,
  }));

  const invoiceStatusData = (["Paid", "Unpaid", "Partially Paid"] as const).map(
    (status) => ({
      name: status,
      count: filteredInvoices.filter((i) => i.status === status).length,
    })
  );

  const paymentsByTime = filteredPayments.reduce((acc, p) => {
    let key: string;
    switch (timeFilter) {
      case "daily":
      case "weekly":
        key = format(new Date(p.date), "EEE"); // Day of week
        break;
      case "monthly":
        key = format(new Date(p.date), "dd"); // Day of month
        break;
      case "quarterly":
      case "yearly":
        key = format(new Date(p.date), "MMM"); // Month
        break;
    }
    acc[key] = (acc[key] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = Object.entries(paymentsByTime).map(
    ([name, total]) => ({ name, total })
  );
  
   const todayAttendance = attendance.filter(a => isToday(new Date(a.date)));
   const attendanceStatusData = (["Present", "Late", "Absent", "On Leave"] as AttendanceStatus[])
    .map(status => ({
        name: status,
        value: todayAttendance.filter(a => a.status === status).length,
    }))
    .filter(d => d.value > 0);
    
    const kpiStatusData = (["Pending", "In Progress", "Completed"] as KpiStatus[])
        .map(status => ({
            name: status,
            count: kpis.filter(k => k.status === status).length,
        }))
        .filter(d => d.count > 0);

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const showFinanceReports = role === "Finance Manager" || role === "Director";
  const showHrReports = role === "HR/Admin" || role === "CEO" || role === "Director";


  return (
    <Tabs defaultValue="summary">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Reports</h1>
          <p className="text-muted-foreground">
            A summary of the current operational status.
          </p>
        </div>
        <TabsList>
          <TabsTrigger value="summary">
            <PieChartIcon className="mr-2" /> Inventory Summary
          </TabsTrigger>
          <TabsTrigger value="details">
            <FileText className="mr-2" /> Detailed Stock
          </TabsTrigger>
          {showFinanceReports && (
            <TabsTrigger value="finance">
              <Landmark className="mr-2" /> Finance
            </TabsTrigger>
          )}
          {showHrReports && (
            <TabsTrigger value="hr">
                <UserCheck className="mr-2" /> HR
            </TabsTrigger>
          )}
        </TabsList>
      </div>

      <TabsContent value="summary">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Items
                </CardTitle>
                <Warehouse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  Across all equipment types
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Items Available
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAvailable}</div>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0
                    ? Math.round((totalAvailable / totalItems) * 100)
                    : 0}
                  % of stock on hand
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Stocked Item
                </CardTitle>
                <PackagePlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mostStocked?.itemName || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mostStocked?.total || 0} total units
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lowest Stock Item
                </CardTitle>
                <PackageSearch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leastAvailable?.itemName || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {leastAvailable?.available || 0} units available
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">
                  Asset Status by Type
                </CardTitle>
                <CardDescription>
                  A breakdown of asset status for each equipment type.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="min-h-[300px] w-full">
                  <RechartsBarChart data={inventoryWithTotals}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="itemName"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="available"
                      fill="var(--color-chart-2)"
                      radius={4}
                      name="Available"
                    />
                    <Bar
                      dataKey="issued"
                      fill="var(--color-chart-1)"
                      radius={4}
                      name="Issued"
                    />
                    <Bar
                      dataKey="faulty"
                      fill="var(--color-chart-5)"
                      radius={4}
                      name="Faulty"
                    />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">
                  Asset Distribution by Category
                </CardTitle>
                <CardDescription>
                  Shows the proportion of assets in each category.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ChartContainer
                  config={{}}
                  className="min-h-[300px] w-full max-w-sm"
                >
                  <PieChart>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Pie
                      data={categoryTotals}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      labelLine={false}
                      label={({ percent, name }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryTotals.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">
                  Detailed Stock Report
                </CardTitle>
                <CardDescription>
                  A detailed breakdown of all items in the inventory.
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => window.print()}>
                Print Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Faulty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[150px]">Stock Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryWithTotals.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.available}</TableCell>
                    <TableCell>{item.issued}</TableCell>
                    <TableCell>{item.faulty}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                      <div className="h-2.5 w-full rounded-full bg-secondary">
                        <div
                          className="h-2.5 rounded-full bg-primary"
                          style={{
                            width: `${
                              item.total > 0
                                ? (item.available / item.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="finance">
        <div className="flex items-center justify-end space-x-2 mb-4">
          {(["daily", "weekly", "monthly", "quarterly", "yearly"] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Quotation Status</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ChartContainer
                  config={{}}
                  className="min-h-[250px] w-full max-w-xs"
                >
                  <PieChart>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Pie
                      data={quotationStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {quotationStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">LPO Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="min-h-[250px] w-full">
                  <RechartsBarChart
                    data={lpoStatusData}
                    layout="vertical"
                    margin={{ left: 10 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))" }}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="count" radius={5}>
                      {lpoStatusData.map((d, i) => (
                        <Cell
                          key={d.name}
                          fill={COLORS[(i + 1) % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Invoice Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="min-h-[250px] w-full">
                  <RechartsBarChart data={invoiceStatusData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={4}>
                      {invoiceStatusData.map((d, i) => (
                        <Cell key={d.name} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">
                  Payments Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="min-h-[250px] w-full">
                  <RechartsBarChart data={paymentChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis tickFormatter={(val) => `UGX ${val / 1000}k`} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="total"
                      name="Total Payments"
                      fill="var(--color-chart-2)"
                      radius={4}
                    />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="hr">
        <div className="grid gap-6 md:grid-cols-2">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Today's Attendance</CardTitle>
                 <CardDescription>A snapshot of staff attendance for the current day.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ChartContainer
                  config={{}}
                  className="min-h-[250px] w-full max-w-xs"
                >
                  <PieChart>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Pie
                      data={attendanceStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {attendanceStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">KPI Performance</CardTitle>
                <CardDescription>An overview of the status of all KPIs.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="min-h-[250px] w-full">
                  <RechartsBarChart
                    data={kpiStatusData}
                    layout="vertical"
                    margin={{ left: 10 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))" }}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="count" radius={5}>
                       {kpiStatusData.map((d, i) => (
                        <Cell
                          key={d.name}
                          fill={COLORS[(i + 2) % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
