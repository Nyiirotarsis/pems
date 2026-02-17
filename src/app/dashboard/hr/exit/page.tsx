"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isBefore } from "date-fns";
import {
  ArrowLeft,
  UserMinus,
  PlusCircle,
  MoreVertical,
  CheckCircle,
  Clock,
  Loader,
  Eye,
  Calendar as CalendarIcon,
} from "lucide-react";

import PEMSDashboard from "@/components/pems-dashboard";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { USERS } from "@/lib/mock-data";
import type { User, ExitProcess, DepartmentClearance } from "@/types";

// Mock data directly in the component for now
const mockExitProcesses: ExitProcess[] = [
  {
    id: 1,
    userId: 16, // Ngota Steven
    exitDate: "2024-09-30",
    status: "Ongoing",
    clearance: [
      {
        department: "Store",
        status: "Cleared",
        items: [
          { id: "store-1", name: "Handover store keys", cleared: true },
          { id: "store-2", name: "Final stock-take report", cleared: true },
        ],
      },
      {
        department: "IT",
        status: "Cleared",
        items: [
          { id: "it-1", name: "Return company laptop & charger", cleared: true },
          { id: "it-2", name: "Disable system accounts", cleared: true },
        ],
      },
      {
        department: "HR",
        status: "In Progress",
        items: [
          { id: "hr-1", name: "Conduct exit interview", cleared: true },
          { id: "hr-2", name: "Sign final paperwork", cleared: false },
          { id: "hr-3", name: "Confirm final pay details", cleared: false },
        ],
      },
      {
        department: "Finance",
        status: "Pending",
        items: [
          { id: "fin-1", name: "Settle any outstanding advances", cleared: false },
          { id: "fin-2", name: "Process final payout", cleared: false },
        ],
      },
    ],
  },
];
// End mock data

const exitFormSchema = z.object({
  userId: z.string().min(1, "Please select an employee."),
  exitDate: z.date({ required_error: "Please select an exit date." }),
});

type ExitFormValues = z.infer<typeof exitFormSchema>;


export default function ExitManagementPage() {
    const [exitProcesses, setExitProcesses] = React.useState<ExitProcess[]>(mockExitProcesses);
    const [isExitFormOpen, setIsExitFormOpen] = React.useState(false);
    const [isChecklistOpen, setIsChecklistOpen] = React.useState(false);
    const [selectedProcess, setSelectedProcess] = React.useState<ExitProcess | null>(null);
    const { toast } = useToast();
    
    const form = useForm<ExitFormValues>({
        resolver: zodResolver(exitFormSchema),
    });

    const summaryStats = React.useMemo(() => {
        const ongoing = exitProcesses.filter(p => p.status === 'Ongoing').length;
        const completed = exitProcesses.filter(p => p.status === 'Completed').length;
        return { ongoing, completed };
    }, [exitProcesses]);
    
    const getUser = (userId: number): User | undefined => USERS.find(u => u.id === userId);

    const getClearanceProgress = (process: ExitProcess) => {
        const totalItems = process.clearance.reduce((acc, dept) => acc + dept.items.length, 0);
        const clearedItems = process.clearance.reduce((acc, dept) => acc + dept.items.filter(i => i.cleared).length, 0);
        return totalItems > 0 ? (clearedItems / totalItems) * 100 : 0;
    };
    
    const handleStartExit = (data: ExitFormValues) => {
        const newProcess: ExitProcess = {
            id: exitProcesses.length + 1,
            userId: parseInt(data.userId),
            exitDate: format(data.exitDate, "yyyy-MM-dd"),
            status: "Ongoing",
            clearance: [ // Default checklist
                { department: "Store", status: "Pending", items: [{ id: "s1", name: "Return all issued equipment", cleared: false }] },
                { department: "IT", status: "Pending", items: [{ id: "it1", name: "Return laptop/peripherals", cleared: false }, { id: "it2", name: "Disable accounts", cleared: false }] },
                { department: "Finance", status: "Pending", items: [{ id: "f1", name: "Settle all claims", cleared: false }] },
                { department: "HR", status: "Pending", items: [{ id: "hr1", name: "Exit interview", cleared: false }, { id: "hr2", name: "Final documentation", cleared: false }] },
            ]
        };
        setExitProcesses(prev => [newProcess, ...prev]);
        toast({ title: "Exit Process Started", description: `Clearance has been initiated for the selected employee.` });
        setIsExitFormOpen(false);
        form.reset();
    };

    const handleUpdateClearance = (processId: number, department: DepartmentClearance['department'], itemId: string, cleared: boolean) => {
        setExitProcesses(prev => prev.map(p => {
            if (p.id === processId) {
                const newClearance = p.clearance.map(d => {
                    if (d.department === department) {
                        const newItems = d.items.map(i => i.id === itemId ? { ...i, cleared } : i);
                        const allCleared = newItems.every(i => i.cleared);
                        return { ...d, items: newItems, status: allCleared ? 'Cleared' as const : 'In Progress' as const };
                    }
                    return d;
                });
                return { ...p, clearance: newClearance };
            }
            return p;
        }));
    };

    return (
        <PEMSDashboard initialRole="HR/Admin">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <Button asChild variant="outline" size="icon">
                                    <Link href="/dashboard/hr"><ArrowLeft className="h-4 w-4" /></Link>
                                </Button>
                                <div>
                                    <CardTitle className="font-headline text-2xl">Exit Management</CardTitle>
                                    <CardDescription>Oversee and manage the staff exit and clearance process.</CardDescription>
                                </div>
                            </div>
                            <Dialog open={isExitFormOpen} onOpenChange={setIsExitFormOpen}>
                                <DialogTrigger asChild>
                                    <Button><PlusCircle className="mr-2" /> Start Exit Process</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Initiate Staff Exit</DialogTitle>
                                        <DialogDescription>Select the employee and their last working day.</DialogDescription>
                                    </DialogHeader>
                                     <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleStartExit)} className="space-y-4 pt-4">
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
                                            <FormField
                                                control={form.control}
                                                name="exitDate"
                                                render={({ field }) => (
                                                <FormItem><FormLabel>Last Working Day</FormLabel>
                                                <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                                                <FormMessage /></FormItem>)} />
                                            <DialogFooter>
                                                <Button type="button" variant="ghost" onClick={() => setIsExitFormOpen(false)}>Cancel</Button>
                                                <Button type="submit">Initiate</Button>
                                            </DialogFooter>
                                        </form>
                                     </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                </Card>

                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Ongoing Clearances</CardTitle><Loader className="h-4 w-4 text-muted-foreground animate-spin" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.ongoing}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed This Month</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.completed}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Final Payout</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.ongoing}</div></CardContent></Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Exit Pipeline</CardTitle>
                        <CardDescription>Staff currently in the off-boarding process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Exit Date</TableHead>
                                    <TableHead>Clearance Progress</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exitProcesses.map(p => {
                                    const user = getUser(p.userId);
                                    const progress = getClearanceProgress(p);
                                    return (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{user?.name || 'Unknown'}</TableCell>
                                            <TableCell>{format(new Date(p.exitDate), "PPP")}</TableCell>
                                            <TableCell><Progress value={progress} className="w-[60%]" /></TableCell>
                                            <TableCell>
                                                <Badge variant={p.status === "Completed" ? "default" : "secondary"}>{p.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedProcess(p); setIsChecklistOpen(true); }}><Eye className="mr-2 h-4 w-4"/> View Checklist</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Clearance Checklist: {getUser(selectedProcess?.userId || 0)?.name}</DialogTitle>
                        <DialogDescription>
                            Track clearance status across all relevant departments.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        {selectedProcess?.clearance.map(dept => (
                            <div key={dept.department}>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold">{dept.department}</h4>
                                    <Badge variant={dept.status === 'Cleared' ? 'default' : 'secondary'}>{dept.status}</Badge>
                                </div>
                                <div className="space-y-2 pl-4 border-l-2">
                                    {dept.items.map(item => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`${dept.department}-${item.id}`} 
                                                checked={item.cleared}
                                                onCheckedChange={(checked) => handleUpdateClearance(selectedProcess.id, dept.department, item.id, !!checked)}
                                            />
                                            <Label htmlFor={`${dept.department}-${item.id}`}>{item.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </PEMSDashboard>
    );
}
