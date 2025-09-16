"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  PlusCircle,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  attendanceFormSchema,
  fieldPaymentRequestSchema,
} from "@/lib/schemas";
import type {
  AttendanceRecord,
  AttendanceStatus,
  FieldPaymentRequest,
  FieldPaymentStatus,
  UserRole,
} from "@/types";
import { mockUsers, mockFieldStaff } from "@/lib/mock-data";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type AttendanceViewProps = {
  attendance: AttendanceRecord[];
  onAddRecord: (values: z.infer<typeof attendanceFormSchema>) => void;
  role: UserRole | null;
  fieldPayments: FieldPaymentRequest[];
  onAddFieldPayment: (
    values: z.infer<typeof fieldPaymentRequestSchema>
  ) => void;
  onUpdateFieldPaymentStatus: (id: number, status: FieldPaymentStatus) => void;
};

export function AttendanceView({
  attendance,
  onAddRecord,
  role,
  fieldPayments,
  onAddFieldPayment,
  onUpdateFieldPaymentStatus,
}: AttendanceViewProps) {
  const defaultTab = role === "CEO" ? "field_payments" : "records";
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
    onAddFieldPayment(values);
    paymentForm.reset({
      requestDate: new Date(),
      daysWorked: 1,
      rate: 0,
      staffId: undefined,
      workDescription: "",
    });
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
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList
        className={cn(
          "grid w-full",
          role === "CEO" || isFinance ? "grid-cols-3" : "grid-cols-2"
        )}
      >
        <TabsTrigger value="records">Staff Attendance</TabsTrigger>
        <TabsTrigger value="log">Log Attendance</TabsTrigger>
        {(role === "CEO" || isFinance) && (
          <TabsTrigger value="field_payments">Field Payments</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="log">
        <StaffAttendanceLogForm onAddRecord={onAddRecord} />
      </TabsContent>
      <TabsContent value="records">
        <StaffAttendanceRecords attendance={attendance} />
      </TabsContent>
      {(role === "CEO" || isFinance) && (
        <TabsContent value="field_payments">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle className="font-headline">
                        Field Staff Payments
                      </CardTitle>
                      <CardDescription>
                        Create and track payment requisitions for casual
                        workers.
                      </CardDescription>
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
                                      onUpdateFieldPaymentStatus(p.id, "Paid")
                                    }
                                  >
                                    Mark as Paid
                                  </DropdownMenuItem>
                                )}
                                {role === "CEO" && p.status === "Paid" && (
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      onUpdateFieldPaymentStatus(
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
        </TabsContent>
      )}
    </Tabs>
  );
}

function StaffAttendanceLogForm({
  onAddRecord,
}: {
  onAddRecord: (values: z.infer<typeof attendanceFormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof attendanceFormSchema>>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      date: new Date(),
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof attendanceFormSchema>) {
    onAddRecord(values);
    form.reset({
      date: new Date(),
      userId: undefined,
      status: undefined,
      notes: "",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Log Daily Attendance</CardTitle>
        <CardDescription>
          Select the user and mark their attendance for the day.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.username} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
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
                      <PopoverContent className="w-auto p-0" align="start">
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
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Present" id="s-present" />
                        <Label htmlFor="s-present">Present</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Late" id="s-late" />
                        <Label htmlFor="s-late">Late</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Absent" id="s-absent" />
                        <Label htmlFor="s-absent">Absent</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="On Leave" id="s-leave" />
                        <Label htmlFor="s-leave">On Leave</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Arrived late due to traffic"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">Save Record</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log the attendance record for the selected user.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function StaffAttendanceRecords({
  attendance,
}: {
  attendance: AttendanceRecord[];
}) {
  const getUserDetails = (userId: number) => {
    return mockUsers.find((u) => u.id === userId);
  };

  const statusColors: Record<AttendanceStatus, string> = {
    Present:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    Late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    Absent: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    "On Leave":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Attendance History</CardTitle>
        <CardDescription>A log of all recorded attendance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((record) => {
              const user = getUserDetails(record.userId);
              return (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.role}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn("capitalize", statusColors[record.status])}
                      variant="outline"
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.notes || "N/A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
