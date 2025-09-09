"use client";

import * as React from "react";
import {
  FilePlus,
  Trash2,
  Paperclip,
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Receipt,
  FileText,
  Truck
} from "lucide-react";
import {
  mockQuotations,
  mockLPOs,
  mockInvoices,
  mockPayments,
} from "@/lib/mock-data";
import type { Quotation, LPO, Invoice, Payment, FinancialStatus } from "@/types";

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const statusColors: Record<FinancialStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700",
    Approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
    Rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
    Paid: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
    "Partially Paid": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700",
    Delivered: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-700",
    Unpaid: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700",
};

const statusIcons: Record<FinancialStatus, React.ElementType> = {
    Pending: Clock,
    Approved: CheckCircle,
    Rejected: XCircle,
    Paid: DollarSign,
    "Partially Paid": DollarSign,
    Delivered: Truck,
    Unpaid: Clock,
};

function StatusBadge({ status }: { status: FinancialStatus }) {
  const Icon = statusIcons[status as keyof typeof statusIcons] || Clock;
  return (
    <Badge variant="outline" className={cn("capitalize", statusColors[status])}>
      <Icon className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  );
}


export function FinanceModule() {
  const [quotations, setQuotations] = React.useState<Quotation[]>(mockQuotations);
  const [lpos, setLpos] = React.useState<LPO[]>(mockLPOs);
  const [invoices, setInvoices] = React.useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = React.useState<Payment[]>(mockPayments);

  return (
    <Tabs defaultValue="quotations" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="quotations">Quotations</TabsTrigger>
        <TabsTrigger value="lpos">LPOs</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      <TabsContent value="quotations">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline">Quotations</CardTitle>
                <CardDescription>
                  Manage service or item quotations.
                </CardDescription>
              </div>
              <Button disabled>
                <FilePlus className="mr-2" /> Create Quotation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Service/Item</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.number}</TableCell>
                    <TableCell>{q.service}</TableCell>
                    <TableCell>{q.date}</TableCell>
                    <TableCell>${q.amount.toFixed(2)}</TableCell>
                    <TableCell><StatusBadge status={q.status} /></TableCell>
                    <TableCell className="text-right">
                      <ItemActions item={q} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="lpos">
        <Card>
           <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline">Local Purchase Orders (LPOs)</CardTitle>
                <CardDescription>
                  Track LPOs converted from approved quotations.
                </CardDescription>
              </div>
              <Button disabled>
                <FileText className="mr-2" /> Issue LPO
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Number</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lpos.map((lpo) => (
                        <TableRow key={lpo.id}>
                            <TableCell className="font-medium">{lpo.number}</TableCell>
                            <TableCell>{lpo.supplier}</TableCell>
                            <TableCell>{lpo.date}</TableCell>
                            <TableCell>${lpo.amount.toFixed(2)}</TableCell>
                            <TableCell><StatusBadge status={lpo.status} /></TableCell>
                            <TableCell className="text-right"><ItemActions item={lpo} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="invoices">
        <Card>
           <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline">Invoices</CardTitle>
                <CardDescription>
                  Manage and track supplier invoices.
                </CardDescription>
              </div>
              <Button disabled>
                <Receipt className="mr-2" /> Capture Invoice
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Number</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                            <TableCell className="font-medium">{inv.number}</TableCell>
                            <TableCell>{inv.supplier}</TableCell>
                            <TableCell>{inv.date}</TableCell>
                            <TableCell>{inv.dueDate}</TableCell>
                            <TableCell>${inv.amount.toFixed(2)}</TableCell>
                            <TableCell><StatusBadge status={inv.status} /></TableCell>
                            <TableCell className="text-right"><ItemActions item={inv} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="payments">
        <Card>
           <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline">Payments</CardTitle>
                <CardDescription>
                  Record and track payments made against invoices.
                </CardDescription>
              </div>
              <Button disabled>
                <DollarSign className="mr-2" /> Record Payment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Amount Paid</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.invoiceNumber}</TableCell>
                            <TableCell>{p.date}</TableCell>
                            <TableCell>${p.amount.toFixed(2)}</TableCell>
                            <TableCell>{p.method}</TableCell>
                            <TableCell className="text-right"><ItemActions item={p} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}


function ItemActions({ item }: { item: any }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 <DropdownMenuItem disabled>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Paperclip className="mr-2 h-4 w-4" />
                    <span>Attach File</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="text-red-500 focus:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
