
"use client";

import React, { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockFieldPaymentRequests } from "@/lib/mock-data";
import PEMSDashboard from "@/components/pems-dashboard";
import { FieldPaymentRequest, FieldPaymentStatus, UserRole } from "@/types";

export default function PerDiemListPage() {
  const { toast } = useToast();
  const [perDiemRecords, setPerDiemRecords] = useState(mockFieldPaymentRequests);
  const [role, setRole] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const canApprove = role === "Director" || role === "CEO";

  const handleUpdateStatus = (id: number, status: FieldPaymentStatus) => {
    setPerDiemRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status } : rec))
    );
    toast({ title: `Per Diem record ${status.toLowerCase()}.` });
  };

  const paymentStatusColors: Record<FieldPaymentStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    Paid: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    Acknowledged: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  };

  return (
    <PEMSDashboard initialRole="HR/Admin">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Per Diem / Field Payments List
          </CardTitle>
          <CardDescription>
            Manage and track event-based payments for all staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Work Description</TableHead>
                <TableHead className="text-right">Total Amount (UGX)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perDiemRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.staffName}</TableCell>
                  <TableCell>{record.workDescription}</TableCell>
                  <TableCell className="text-right">
                    {record.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[record.status]}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.requestDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {canApprove && record.status === "Pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(record.id, "Paid")}
                            >
                              <CheckCircle className="mr-2" />
                              Approve for Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(record.id, "Acknowledged")}
                              className="text-red-500 focus:text-red-500"
                            >
                              <XCircle className="mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                         {record.status === "Paid" && (
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(record.id, "Acknowledged")}
                                >
                                <CheckCircle className="mr-2"/>
                                Acknowledge
                            </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PEMSDashboard>
  );
}

