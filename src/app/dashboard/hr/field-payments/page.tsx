
"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  PlusCircle,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { fieldPaymentRequestSchema } from "@/lib/schemas";
import type {
  FieldPaymentRequest,
  FieldPaymentStatus,
  UserRole,
} from "@/types";
import { mockFieldStaff, mockFieldPaymentRequests, ROLES } from "@/lib/mock-data";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { addFieldPaymentRequest, updateFieldPaymentStatus } from "@/lib/hr";
import { useRouter } from "next/navigation";


export default function FieldPaymentsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [role, setRole] = React.useState<UserRole | null>(null);
  const [fieldPayments, setFieldPayments] = React.useState(mockFieldPaymentRequests);

   React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole && ROLES.includes(storedRole)) {
      setRole(storedRole);
    } else {
      router.push('/login');
    }
  }, [router]);

  const paymentForm = useForm<z.infer<typeof fieldPaymentRequestSchema>>({
    resolver: zodResolver(fieldPaymentRequestSchema),
    defaultValues: {
      requestDate: new Date(),
      daysWorked: 1,
      rate: 0,
    },
  });

  function handlePaymentSubmit(
    values: z.infer<typeof fieldPaymentRequestSchema>
  ) {
    const { newRequest, error } = addFieldPaymentRequest(fieldPayments, values);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    } else if (newRequest) {
      setFieldPayments((prev) => [newRequest, ...prev]);
      // In a real app, this would trigger a server-side notification
      console.log(
        `Notification for Finance Manager: New payment request for ${newRequest.staffName}`
      );
      toast({
        title: "Payment Request Submitted",
        description: `Requisition for ${newRequest.staffName} has been sent to Finance.`,
      });
      paymentForm.reset({
        requestDate: new Date(),
        daysWorked: 1,
        rate: 0,
        staffId: undefined,
        workDescription: "",
      });
    }
  }
  
  function handleUpdateStatus(id: number, status: FieldPaymentStatus) {
    const { updatedPayments, updatedPayment, error } = updateFieldPaymentStatus(fieldPayments, id, status);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    } else if (updatedPayment) {
      setFieldPayments(updatedPayments);
      if (status === 'Paid') {
          // In a real app, this would trigger a server-side notification
          console.log(`Notification for CEO: Payment for ${updatedPayment.staffName} has been processed.`);
      }
      if (status === 'Acknowledged') {
          // In a real app, this would trigger a server-side notification
          console.log(`Notification for Finance Manager: CEO has acknowledged payment for ${updatedPayment.staffName}.`);
      }
    }
  }


  const isFinance = role === "Finance Manager";

  const paymentStatusColors: Record<FieldPaymentStatus, string> = {
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    Paid: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    Acknowledged:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  };

  const paymentByStaff = fieldPayments.reduce((acc, p) => {
    if (p.status === "Paid" || p.status === "Acknowledged") {
      acc[p.staffName] = (acc[p.staffName] || 0) + p.totalAmount;
    }
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = Object.entries(paymentByStaff).map(
    ([name, amount]) => ({ name, amount })
  );

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
               <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <CardTitle className="font-headline">
                    Field Staff Payments
                  </CardTitle>
                  <CardDescription>
                    Create and track payment requisitions for casual workers.
                  </CardDescription>
                </div>
              </div>
              {role === "CEO" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Field Payment Request</DialogTitle>
                      <DialogDescription>
                        Fill in the details to send a payment requisition
                        to finance.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...paymentForm}>
                      <form
                        onSubmit={paymentForm.handleSubmit(
                          handlePaymentSubmit
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={paymentForm.control}
                          name="staffId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Staff Member</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a staff member" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {mockFieldStaff.map((s) => (
                                    <SelectItem
                                      key={s.id}
                                      value={s.id.toString()}
                                    >
                                      {s.name} ({s.role})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="workDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Work Description</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Stage setup for Judiciary event"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={paymentForm.control}
                            name="daysWorked"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Days/Units</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.5"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={paymentForm.control}
                            name="rate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rate (UGX)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={paymentForm.control}
                          name="requestDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Request Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value &&
                                          "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button type="button">
                                Submit Request
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will send a payment requisition to
                                  the finance department.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={paymentForm.handleSubmit(
                                    handlePaymentSubmit
                                  )}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.staffName}
                    </TableCell>
                    <TableCell>{p.workDescription}</TableCell>
                    <TableCell>
                      UGX {p.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={paymentStatusColors[p.status]}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(p.requestDate), "PPP")}
                    </TableCell>
                    <TableCell>
                      {p.paymentDate
                        ? format(new Date(p.paymentDate), "PPP")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {isFinance && p.status === "Pending" && (
                            <DropdownMenuItem
                              onSelect={() =>
                                handleUpdateStatus(p.id, "Paid")
                              }
                            >
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {role === "CEO" && p.status === "Paid" && (
                            <DropdownMenuItem
                              onSelect={() =>
                                handleUpdateStatus(
                                  p.id,
                                  "Acknowledged"
                                )
                              }
                            >
                              Acknowledge & Upload Receipt
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
        <Card>
          <CardHeader>
            <CardTitle>Payments by Staff</CardTitle>
            <CardDescription>
              Total amounts paid out to field staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="min-h-[250px] w-full">
              <RechartsBarChart
                data={paymentChartData}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis
                  type="number"
                  dataKey="amount"
                  tickFormatter={(val) => `UGX ${val / 1000}k`}
                />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--chart-1))"
                  radius={4}
                />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
