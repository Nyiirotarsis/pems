
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
import { PlusCircle, MoreVertical, CheckCircle, XCircle } from "lucide-react";
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
import { User, UserRole } from "@/types";
import { payrollFormSchema } from "@/lib/schemas";


// Mock data based on your spec
const mockPayrollData = [
    {
        id: 1,
        staffId: 12,
        month: 'July',
        year: 2024,
        basicPay: 5000000,
        otherBenefits: 500000,
        salaryAdvance: 0,
        status: 'Approved' as 'Pending' | 'Approved' | 'Rejected',
    },
    {
        id: 2,
        staffId: 13,
        month: 'July',
        year: 2024,
        basicPay: 7000000,
        otherBenefits: 1000000,
        salaryAdvance: 500000,
        status: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
    }
];

type PayrollFormValues = z.infer<typeof payrollFormSchema>;

function calculatePayroll(basicPay: number, otherBenefits: number, salaryAdvance: number) {
    const grossPay = basicPay + otherBenefits;
    // Simplified tax calculation for demonstration
    const nssf5 = grossPay * 0.05;
    const taxableIncome = grossPay - nssf5;
    let paye = 0;
    if (taxableIncome > 10000000) {
        paye = (taxableIncome - 10000000) * 0.4 + 2560000;
    } else if (taxableIncome > 410000) {
        paye = (taxableIncome - 410000) * 0.3 + 35500;
    } else if (taxableIncome > 335000) {
        paye = (taxableIncome - 335000) * 0.2 + 10000;
    } else if (taxableIncome > 235000) {
        paye = (taxableIncome - 235000) * 0.1;
    }

    const lst = grossPay > 300000 ? 5000 : 0; // Simplified LST
    const totalDeductions = nssf5 + paye + lst + salaryAdvance;
    const netPay = grossPay - totalDeductions;
    
    return { grossPay, taxableIncome, nssf5, paye, lst, totalDeductions, netPay };
}

function PayrollForm({ user, onSave, onFinished }: { user?: User | null, onSave: (data: PayrollFormValues) => void, onFinished: () => void }) {
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

  const watchedStaffId = form.watch("staffId");

  React.useEffect(() => {
    if (watchedStaffId) {
        const selectedUser = mockUsers.find(u => u.id === parseInt(watchedStaffId));
        if (selectedUser) {
            form.setValue("staffFileNo", selectedUser.staffFileNo || "");
            form.setValue("position", selectedUser.role || "");
            form.setValue("tin", selectedUser.tin || "");
            form.setValue("nssf", selectedUser.nssf || "");
        }
    }
  }, [watchedStaffId, form]);

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
                    <SelectContent>{mockUsers.filter(u => u.name).map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="staffFileNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff File No.</FormLabel>
                   <FormControl><Input {...field} readOnly /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                   <FormControl><Input {...field} readOnly /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN No.</FormLabel>
                   <FormControl><Input {...field} readOnly /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nssf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NSSF No.</FormLabel>
                   <FormControl><Input {...field} readOnly /></FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            staffId: parseInt(data.staffId),
            month: data.month,
            year: data.year,
            basicPay: data.basicPay,
            otherBenefits: data.otherBenefits,
            salaryAdvance: data.salaryAdvance,
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
                            <TableHead>Staff File No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>TIN No.</TableHead>
                            <TableHead>NSSF No.</TableHead>
                            <TableHead className="text-right">Basic Pay</TableHead>
                            <TableHead className="text-right">Other Benefits</TableHead>
                            <TableHead className="text-right">Gross Pay</TableHead>
                            <TableHead className="text-right">Taxable Income</TableHead>
                            <TableHead className="text-right">NSSF 5%</TableHead>
                            <TableHead className="text-right">PAYE/URA</TableHead>
                            <TableHead className="text-right">LST</TableHead>
                            <TableHead className="text-right">Salary Advance</TableHead>
                            <TableHead className="text-right">Total Deductions</TableHead>
                            <TableHead className="text-right">Net Pay</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fullPayrollData.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell>{record.staff?.staffFileNo || 'N/A'}</TableCell>
                            <TableCell className="font-medium">{record.staff?.name || 'N/A'}</TableCell>
                            <TableCell>{record.staff?.role || 'N/A'}</TableCell>
                            <TableCell>{record.staff?.tin || 'N/A'}</TableCell>
                            <TableCell>{record.staff?.nssf || 'N/A'}</TableCell>
                            <TableCell className="text-right">{record.basicPay.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{record.otherBenefits.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium">{record.grossPay.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{record.taxableIncome.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{record.nssf5.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{record.paye.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{record.lst.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{record.salaryAdvance.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-destructive">{record.totalDeductions.toLocaleString()}</TableCell>
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
                <p className="text-xs text-muted-foreground">This table shows the full payroll breakdown for each staff member.</p>
            </CardFooter>
        </Card>
        <DialogContent className="max-w-4xl">
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
