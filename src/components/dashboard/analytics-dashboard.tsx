
"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { InventoryItem } from "@/types";
import { assetCategories } from "@/lib/mock-data";

type AnalyticsDashboardProps = {
  inventory: InventoryItem[];
};

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

export default function AnalyticsDashboard({ inventory }: AnalyticsDashboardProps) {
  const totalAssets = inventory.reduce(
    (sum, item) => sum + item.quantityAvailable,
    0
  );
  const available = inventory
    .filter((i) => i.status === "Available")
    .reduce((sum, item) => sum + item.quantityAvailable, 0);
  const issued = inventory
    .filter((i) => i.status === "Out")
    .reduce((sum, item) => sum + item.quantityAvailable, 0);
  const underRepair = inventory
    .filter((i) => i.status === "Under Repair")
    .reduce((sum, item) => sum + item.quantityAvailable, 0);

  const statusData = [
    { name: "Available", value: available },
    { name: "Issued Out", value: issued },
    { name: "Under Repair", value: underRepair },
  ].filter(d => d.value > 0);

  const categoryData = assetCategories.map((cat) => ({
    category: cat,
    count: inventory
      .filter((i) => i.category === cat)
      .reduce((sum, item) => sum + item.quantityAvailable, 0),
  })).filter(d => d.count > 0);

  const kpiCards = [
    {
      title: "Total Assets",
      value: totalAssets,
      icon: Package,
      description: "All gadgets and equipment",
    },
    {
      title: "Available",
      value: available,
      icon: CheckCircle,
      description: "Items ready for use",
    },
    {
      title: "Issued Out",
      value: issued,
      icon: AlertTriangle,
      description: "Currently deployed items",
    },
    {
      title: "Under Repair",
      value: underRepair,
      icon: Wrench,
      description: "Items needing maintenance",
    },
  ];

  return (
    <div className="grid gap-6 pt-4">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status Overview</CardTitle>
            <CardDescription>
              A breakdown of item statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipment by Category</CardTitle>
            <CardDescription>
              Shows how many gadgets belong to each category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
