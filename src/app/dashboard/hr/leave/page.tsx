
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, isWithinInterval, startOfMonth, endOfMonth, isToday } from "date-fns";
import { Calendar as CalendarIcon, MoreVertical, PlusCircle, Check, X, Hand, Mail, Briefcase } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { leaveRequestFormSchema } from "@/lib/schemas";
import type { LeaveRequest, LeaveStatus, LeaveType, User, UserRole } from "@/types";
import { mockLeaveRequests, USERS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

import PEMSDashboard from "@/components/pems-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Pie, PieChart as RechartsPieChart, Cell, XAxis, YAxis, Tooltip, Legend } from "recharts";

const leaveTypeColors: Record<LeaveType, string> = {
    Annual: "bg-blue-100 text-blue-800",
    Sick: "bg-orange-100 text-orange-800",
    Maternity: "bg-pink-100 text-pink-800",
    Paternity: "bg-indigo-100 text-indigo-800",
    Unpaid: "bg-gray-100 text-gray-800",
    Compassionate: "bg-purple-100 text-purple-800",
};

const leaveStatusColors: Record<LeaveStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
};

function LeaveRequestForm({ onSave, onFinished, currentUserRole }: { onSave: (data: z.infer<typeof leaveRequestFormSchema>) => void, onFinished: () => void, currentUserRole: UserRole | null }) {
  const form = useForm<z.infer<typeof leaveRequestFormSchema>>({
    resolver: zodResolver(leaveRequestFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const handleSubmit = (data: z.infer<typeof leaveRequestFormSchema>) => {
    onSave(data);
    onFinished();
  };
  
  const canSelectUser = currentUserRole === 'HR/Admin' || currentUserRole === 'CEO' || currentUserRole === 'Director';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {canSelectUser && (
            <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Employee</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an employee" /></SelectTrigger></FormControl>
                    <SelectContent>{USERS.map(u => u.name && <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a leave type" /></SelectTrigger></FormControl>
                <SelectContent>
                  {(Object.keys(leaveTypeColors) as LeaveType[]).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                <FormItem><FormLabel>Start Date</FormLabel>
                <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                <FormMessage /></FormItem>)} />
            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                <FormItem><FormLabel>End Date</FormLabel>
                <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                <FormMessage /></FormItem>)} />
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Leave</FormLabel>
              <FormControl><Textarea placeholder="Provide a brief reason for your request..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
          <Button type="submit">Submit Request</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function LeaveManagementPage() {
    const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>(mockLeaveRequests);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [role, setRole] = React.useState<UserRole | null>(null);
    const { toast } = useToast();
    
    React.useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as UserRole | null;
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const summaryStats = React.useMemo(() => {
        const now = new Date();
        const thisMonthInterval = { start: startOfMonth(now), end: endOfMonth(now) };

        const pendingRequests = leaveRequests.filter(r => r.status === 'Pending').length;
        const approvedThisMonth = leaveRequests.filter(r => 
            r.status === 'Approved' && 
            r.reviewDate && 
            isWithinInterval(new Date(r.reviewDate), thisMonthInterval)
        ).length;
        const staffOnLeaveToday = leaveRequests.filter(r => 
            r.status === 'Approved' && 
            isWithinInterval(now, { start: new Date(r.startDate), end: new Date(r.endDate) })
        ).length;
        
        const leaveByType = (Object.keys(leaveTypeColors) as LeaveType[]).map(type => ({
            name: type,
            value: leaveRequests.filter(r => r.leaveType === type).length
        })).filter(d => d.value > 0);

        return { pendingRequests, approvedThisMonth, staffOnLeaveToday, leaveByType };
    }, [leaveRequests]);

    const handleSaveRequest = (data: z.infer<typeof leaveRequestFormSchema>) => {
        // In a real app, the current user ID would come from the session
        const currentUserId = role === 'HR/Admin' ? parseInt(data.userId) : USERS.find(u => u.role === role)?.id || 0;

        const newRequest: LeaveRequest = {
            id: leaveRequests.length + 1,
            userId: currentUserId,
            leaveType: data.leaveType,
            startDate: format(data.startDate, "yyyy-MM-dd"),
            endDate: format(data.endDate, "yyyy-MM-dd"),
            reason: data.reason,
            status: "Pending",
            requestedDate: format(new Date(), "yyyy-MM-dd"),
        };
        setLeaveRequests(prev => [newRequest, ...prev]);
        toast({ title: "Leave Request Submitted", description: `Your request for ${data.leaveType} leave has been submitted for approval.` });
    };

    const handleUpdateStatus = (id: number, status: 'Approved' | 'Rejected') => {
        setLeaveRequests(prev => prev.map(req => 
            req.id === id ? { ...req, status, reviewedBy: role || 'Admin', reviewDate: format(new Date(), "yyyy-MM-dd") } : req
        ));
        toast({ title: `Leave Request ${status}`, description: `The request has been ${status.toLowerCase()}.` });
    };

    const getUser = (userId: number): User | undefined => USERS.find(u => u.id === userId);

    const canApprove = role === 'HR/Admin' || role === 'CEO' || role === 'Director';
    const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#ca8a04"];

    return (
        <PEMSDashboard initialRole={role}>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                <Button asChild variant="outline" size="icon">
                                    <Link href="/dashboard/hr"><ArrowLeft className="h-4 w-4" /></Link>
                                </Button>
                                <div>
                                    <CardTitle className="font-headline text-2xl">Leave Management</CardTitle>
                                    <CardDescription>Request, view, and manage employee leave.</CardDescription>
                                </div>
                                </div>
                                <DialogTrigger asChild><Button><PlusCircle className="mr-2"/>Request Leave</Button></DialogTrigger>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Requests</CardTitle><Mail className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.pendingRequests}</div></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Approved This Month</CardTitle><Check className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.approvedThisMonth}</div></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Staff On Leave Today</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.staffOnLeaveToday}</div></CardContent></Card>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Leave Requests by Type</CardTitle></CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="min-h-[250px] w-full">
                                <RechartsPieChart>
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Pie data={summaryStats.leaveByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {summaryStats.leaveByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                </RechartsPieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Leave History</CardTitle>
                            <CardDescription>A log of all leave requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Leave Type</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaveRequests.map(req => {
                                        const user = getUser(req.userId);
                                        const days = differenceInDays(new Date(req.endDate), new Date(req.startDate)) + 1;
                                        return (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-medium">{user?.name || 'Unknown'}</TableCell>
                                                <TableCell><Badge variant="outline" className={cn(leaveTypeColors[req.leaveType])}>{req.leaveType}</Badge></TableCell>
                                                <TableCell>{format(new Date(req.startDate), "dd MMM")} - {format(new Date(req.endDate), "dd MMM, yyyy")}</TableCell>
                                                <TableCell>{days}</TableCell>
                                                <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                                <TableCell><Badge variant="outline" className={cn(leaveStatusColors[req.status])}>{req.status}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    {req.status === 'Pending' && canApprove && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem onSelect={() => handleUpdateStatus(req.id, 'Approved')}><Check className="mr-2"/>Approve</DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => handleUpdateStatus(req.id, 'Rejected')} className="text-red-500 focus:text-red-500"><X className="mr-2"/>Reject</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Leave Request</DialogTitle>
                        <DialogDescription>Fill in the details to request time off.</DialogDescription>
                    </DialogHeader>
                    <LeaveRequestForm onSave={handleSaveRequest} onFinished={() => setIsFormOpen(false)} currentUserRole={role} />
                </DialogContent>
            </Dialog>
        </PEMSDashboard>
    );
}
