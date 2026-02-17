
"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { maintenanceLogSchema } from "@/lib/schemas";
import { initialInventory, mockMaintenanceLogs } from "@/lib/mock-data";
import PEMSDashboard from "@/components/pems-dashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type MaintenanceLogValues = z.infer<typeof maintenanceLogSchema>;

function MaintenanceLogForm({ onSave }: { onSave: (data: MaintenanceLogValues) => void }) {
  const { toast } = useToast();
  const form = useForm<MaintenanceLogValues>({
    resolver: zodResolver(maintenanceLogSchema),
    defaultValues: {
      itemName: "",
      serialNumber: "",
      quantity: 1,
      issueDescription: "",
      cause: "",
      hardware: false,
      software: false,
      unitCost: 0,
      totalCost: 0,
      status: "Pending",
      technicianName: "",
      contact: "",
      remarks: "",
    },
  });

  const watchedQuantity = form.watch("quantity");
  const watchedUnitCost = form.watch("unitCost");

  React.useEffect(() => {
    const total = (watchedQuantity || 0) * (watchedUnitCost || 0);
    form.setValue("totalCost", total);
  }, [watchedQuantity, watchedUnitCost, form]);


  function onSubmit(data: MaintenanceLogValues) {
    onSave(data);
    toast({
      title: "Maintenance Log Saved",
      description: `Log for ${data.itemName} has been saved.`,
    });
    form.reset({
        quantity: 1,
        hardware: false,
        software: false,
        status: "Pending",
        itemName: '',
        serialNumber: '',
        issueDescription: '',
        cause: '',
        unitCost: 0,
        totalCost: 0,
        technicianName: '',
        contact: '',
        remarks: '',
    });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Add New Maintenance Log
            </CardTitle>
            <CardDescription>
              Fill in the details for the damaged or faulty asset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an item" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {initialInventory.map((item) => (
                                <SelectItem key={item.id} value={item.itemName}>
                                {item.itemName}
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
                    name="serialNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Serial No./Engraved NO</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., LAP-3-0001" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <FormField
                control={form.control}
                name="issueDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Issue / Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the issue with the item" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="cause"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cause of Damage/Fault</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Power surge, accidental drop" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <div className="flex items-center space-x-4 pt-2">
                        <FormField
                        control={form.control}
                        name="hardware"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel>Hardware</FormLabel>
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="software"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel>Software</FormLabel>
                            </FormItem>
                        )}
                        />
                    </div>
                </FormItem>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="unitCost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Unit Cost (UGX)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="50000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="totalCost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Cost (UGX)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="technicianName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Technician Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Technician Contact</FormLabel>
                        <FormControl>
                            <Input placeholder="077-XXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Remarks / Signature</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Any additional remarks..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">
                  <Save className="mr-2" />
                  Save Log
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will add a new maintenance log to the system.
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


export default function MaintenancePage() {
    const [logs, setLogs] = React.useState(mockMaintenanceLogs);

    const handleSaveLog = (data: MaintenanceLogValues) => {
        const newLog = {
            id: (logs.length + 1).toString(),
            ...data,
            totalCost: data.totalCost || 0
        };
        setLogs(prev => [newLog, ...prev]);
    }
    
    return (
        <PEMSDashboard initialRole="Store Manager">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/store"><ArrowLeft className="h-4 w-4" /></Link>
                  </Button>
                  <div>
                    <h1 className="font-headline text-2xl font-semibold">Maintenance Logs</h1>
                    <p className="text-muted-foreground">
                        Track and manage all maintenance and repair activities.
                    </p>
                  </div>
                </div>

                <MaintenanceLogForm onSave={handleSaveLog} />

                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance History</CardTitle>
                        <CardDescription>A log of all recorded maintenance tasks.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Serial No.</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Total Cost</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Technician</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">{log.itemName}</TableCell>
                                        <TableCell>{log.serialNumber}</TableCell>
                                        <TableCell className="max-w-xs truncate">{log.issueDescription}</TableCell>
                                        <TableCell>UGX {log.totalCost.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={log.status === 'Paid' ? 'default' : 'destructive'}>{log.status}</Badge>
                                        </TableCell>
                                        <TableCell>{log.technicianName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PEMSDashboard>
    )
}
