
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  attendanceFormSchema,
} from "@/lib/schemas";
import type {
  AttendanceRecord,
  AttendanceStatus,
} from "@/types";
import { USERS } from "@/lib/mock-data";

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

type AttendanceViewProps = {
  attendance: AttendanceRecord[];
  onAddRecord: (values: z.infer<typeof attendanceFormSchema>) => void;
};

export function AttendanceView({
  attendance,
  onAddRecord,
}: AttendanceViewProps) {

  return (
    <Tabs defaultValue="records" className="w-full">
      <TabsList
        className="grid w-full grid-cols-2"
      >
        <TabsTrigger value="records">Staff Attendance</TabsTrigger>
        <TabsTrigger value="log">Log Attendance</TabsTrigger>
      </TabsList>
      <TabsContent value="log">
        <StaffAttendanceLogForm onAddRecord={onAddRecord} />
      </TabsContent>
      <TabsContent value="records">
        <StaffAttendanceRecords attendance={attendance} />
      </TabsContent>
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
                        {USERS.map((user) => (
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
    return USERS.find((u) => u.id === userId);
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
