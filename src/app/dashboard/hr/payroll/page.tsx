
"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/lib/mock-data";
import PEMSDashboard from "@/components/pems-dashboard";
import { UserRole } from "@/types";


// Mock data based on your spec
const mockPayrollData = [
    {
        id: 1,
        staffId: 1,
        month: 'July',
        year: 2024,
        basicPay: 5000000,
        otherBenefits: 500000,
        salaryAdvance: 0,
        status: 'Approved' as 'Pending' | 'Approved' | 'Rejected',
    },
    {
        id: 2,
        staffId: 2,
        month: 'July',
        year: 2024,
        basicPay: 7000000,
        otherBenefits: 1000000,
        salaryAdvance: 500000,
        status: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
    }
];

const payrollFormSchema = z.object({
  staffId: z.string().min(1, "Please select a staff member."),
  month: z.string().min(1, "Month is required."),
  year: z.coerce.number().min(2020, "Year must be valid."),
  basicPay: z.coerce.number().min(0, "Basic pay must be a positive number."),
  otherBenefits: z.coerce.number().min(0, "Benefits must be a positive number."),
  salaryAdvance: z.coerce.number().min(0, "Salary advance must be a positive number."),
});

type PayrollFormValues = z.infer<typeof payrollFormSchema>;

function calculatePayroll(basicPay: number, otherBenefits: number, salaryAdvance: number) {
    const grossPay = basicPay + otherBenefits;
    // Simplified tax calculation for demonstration
    const nssf5 = grossPay * 0.05;
    const taxableIncome = grossPay - nssf5;
    const paye = taxableIncome > 410000 ? (taxableIncome - 410000) * 0.3 + 35500 : 0; // Simplified PAYE
    const lst = grossPay > 300000 ? 5000 : 0; // Simplified LST
    const totalDeductions = nssf5 + paye + lst + salaryAdvance;
    const netPay = grossPay - totalDeductions;
    
    return { grossPay, taxableIncome, nssf5, paye, lst, totalDeductions, netPay };
}

function PayrollForm({ onSave, onFinished }: { onSave: (data: PayrollFormValues) => void, onFinished: () => void }) {
  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      basicPay: 0,
      otherBenefits: 0,
      salaryAdvance: 0,
    },
  });
  
  const { toast } = useToast();

  const handleSubmit = (data: PayrollFormValues) => {
    onSave(data);
    toast({ title: "Payroll record added.", description: "The record is pending approval." });
    onFinished();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Member</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger></FormControl>
                    <SelectContent>{mockUsers.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.username}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
                 <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                       <FormControl><Input placeholder="e.g., July" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                       <FormControl><Input type="number" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="basicPay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basic Pay (UGX)</FormLabel>
                   <FormControl><Input type="number" {...field} /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherBenefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Benefits (UGX)</FormLabel>
                   <FormControl><Input type="number" {...field} /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salaryAdvance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Advance (UGX)</FormLabel>
                   <FormControl><Input type="number" {...field} /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button type="submit">Save Record</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default function PayrollPage() {
    const { toast } = useToast();
    const [payrollRecords, setPayrollRecords] = useState(mockPayrollData);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [role, setRole] = React.useState<UserRole | null>(null);

    React.useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as UserRole | null;
        if (storedRole) {
          setRole(storedRole);
        }
    }, []);

    const canApprove = role === "Director" || role === "CEO";
    const canCreate = role === "HR/Admin";

    const handleSaveRecord = (data: PayrollFormValues) => {
        const newRecord = {
            id: payrollRecords.length + 1,
            ...data,
            staffId: parseInt(data.staffId),
            status: 'Pending' as 'Pending',
        };
        setPayrollRecords(prev => [...prev, newRecord]);
    };

    const handleUpdateStatus = (id: number, status: 'Approved' | 'Rejected') => {
        setPayrollRecords(prev => prev.map(rec => rec.id === id ? { ...rec, status } : rec));
        toast({ title: `Payroll record ${status.toLowerCase()}.` });
    }

    const fullPayrollData = useMemo(() => {
        return payrollRecords.map(rec => {
            const user = mockUsers.find(u => u.id === rec.staffId);
            const calculations = calculatePayroll(rec.basicPay, rec.otherBenefits, rec.salaryAdvance);
            return { ...rec, ...calculations, staff: user };
        });
    }, [payrollRecords]);

  return (
    <PEMSDashboard initialRole="HR/Admin">
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">Payroll Management</CardTitle>
                        <CardDescription>
                            Process and track monthly salaries for internal staff.
                        </CardDescription>
                    </div>
                    {canCreate && (
                      <DialogTrigger asChild>
                          <Button>
                              <PlusCircle className="mr-2" /> Add Payroll Record
                          </Button>
                      </DialogTrigger>
                    )}
                </div>
            </CardHeader>
            <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead className="text-right">Gross Pay</TableHead>
                            <TableHead className="text-right">Deductions</TableHead>
                            <TableHead className="text-right">Net Pay</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fullPayrollData.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.staff?.username || 'N/A'}</TableCell>
                            <TableCell>{record.month} {record.year}</TableCell>
                            <TableCell className="text-right">UGX {record.grossPay.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-destructive">UGX {record.totalDeductions.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold">UGX {record.netPay.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    record.status === 'Approved' ? 'default' :
                                    record.status === 'Rejected' ? 'destructive' : 'secondary'
                                }>{record.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        {canCreate && <DropdownMenuItem>Edit</DropdownMenuItem>}
                                        {canApprove && record.status === 'Pending' && (
                                            <>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(record.id, 'Approved')}>
                                                    <CheckCircle className="mr-2"/>Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(record.id, 'Rejected')} className="text-red-500 focus:text-red-500">
                                                    <XCircle className="mr-2"/>Reject
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {canCreate && <DropdownMenuItem className="text-red-500 focus:text-red-500">Delete</DropdownMenuItem>}
                                    </DropdownMenuContent>
                               </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">This table shows a summary. Detailed breakdown of deductions (NSSF, PAYE, LST) is available in the detailed view.</p>
            </CardFooter>
        </Card>
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle>Add New Payroll Record</DialogTitle>
                <DialogDescription>
                    Fill in the details to create a new payroll entry for a staff member.
                </DialogDescription>
            </DialogHeader>
            <PayrollForm onSave={handleSaveRecord} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </PEMSDashboard>
  );
}
