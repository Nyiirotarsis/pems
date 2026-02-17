
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, MoreVertical, Smartphone, Tablet, Monitor, X, CircleHelp, UserPlus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import PEMSDashboard from "@/components/pems-dashboard";
import { mockDevices, USERS, DEVICE_TYPES } from "@/lib/mock-data";
import { deviceFormSchema } from "@/lib/schemas";
import type { Device, DeviceStatus, DeviceType } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<DeviceStatus, { color: string; label: string; icon: React.ElementType }> = {
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending", icon: CircleHelp },
    verified: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Verified", icon: Check },
    approved: { color: "bg-green-100 text-green-800 border-green-200", label: "Approved", icon: Check },
    blocked: { color: "bg-red-100 text-red-800 border-red-200", label: "Blocked", icon: X },
};

const deviceIcons: Record<DeviceType, React.ElementType> = {
    Smartphone: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet,
    'Laser Scan Gun': Tablet,
};

function StatusBadge({ status }: { status: DeviceStatus }) {
    const config = statusConfig[status];
    return <Badge variant="outline" className={cn("capitalize", config.color)}><config.icon className="mr-1 h-3 w-3"/>{config.label}</Badge>;
}

function DeviceIcon({ type }: { type: DeviceType }) {
    const Icon = deviceIcons[type];
    return <Icon className="h-5 w-5 text-muted-foreground"/>
}

function DeviceForm({ device, onSave, onFinished }: { device?: Device | null, onSave: (data: z.infer<typeof deviceFormSchema>, deviceId?: string) => void, onFinished: () => void }) {
    const form = useForm<z.infer<typeof deviceFormSchema>>({
        resolver: zodResolver(deviceFormSchema),
        defaultValues: device ? {
            userId: device.userId.toString(),
            deviceName: device.deviceName,
            deviceType: device.deviceType,
        } : {
            deviceName: "",
        },
    });

    const handleSubmit = (data: z.infer<typeof deviceFormSchema>) => {
        onSave(data, device?.id);
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a user" /></SelectTrigger></FormControl>
                                <SelectContent>{USERS.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.username}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="deviceName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Device Name</FormLabel>
                            <FormControl><Input placeholder="e.g., John's iPhone 14" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="deviceType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Device Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a device type" /></SelectTrigger></FormControl>
                                <SelectContent>{DEVICE_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">Save Device</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

export default function ScanningDevicesPage() {
    const { toast } = useToast();
    const [devices, setDevices] = React.useState<Device[]>(mockDevices);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);

    const handleUpdateStatus = (deviceId: string, newStatus: DeviceStatus) => {
        setDevices(prevDevices => {
            return prevDevices.map(device => {
                if (device.id === deviceId) {
                    toast({
                        title: `Device ${newStatus}`,
                        description: `Device "${device.deviceName}" has been ${newStatus}.`,
                    });
                    return { ...device, status: newStatus, approvedByAdmin: newStatus === 'approved' };
                }
                return device;
            });
        });
    };

    const handleSaveDevice = (data: z.infer<typeof deviceFormSchema>, deviceId?: string) => {
        if (deviceId) {
            // Update existing device
            setDevices(devices.map(d => d.id === deviceId ? { ...d, ...data, userId: parseInt(data.userId), deviceType: data.deviceType as DeviceType } : d));
            toast({ title: 'Device Updated', description: `Device "${data.deviceName}" has been updated.` });
        } else {
            // Add new device
            const newDevice: Device = {
                id: `dev-${Date.now()}`,
                userId: parseInt(data.userId),
                deviceName: data.deviceName,
                deviceType: data.deviceType as DeviceType,
                identifier: `uuid-${Math.random().toString(36).substr(2, 9)}`,
                status: 'pending',
                verifiedByOTP: false,
                approvedByAdmin: false,
                createdAt: new Date().toISOString(),
                lastUsedAt: new Date().toISOString(),
            };
            setDevices(prev => [newDevice, ...prev]);
            toast({ title: 'Device Added', description: `Device "${data.deviceName}" has been added and is pending verification.` });
        }
    };
    
    const handleDeleteDevice = (deviceId: string) => {
        setDevices(devices.filter(d => d.id !== deviceId));
        toast({
            variant: "destructive",
            title: "Device Deleted",
            description: "The device has been removed from the system.",
        });
    };

    return (
        <PEMSDashboard initialRole={null}>
            <Dialog open={isFormOpen} onOpenChange={open => {
                setIsFormOpen(open);
                if (!open) setSelectedDevice(null);
            }}>
                <Card>
                    <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <Button asChild variant="outline" size="icon">
                            <Link href="/dashboard/assets">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            </Button>
                            <div>
                            <CardTitle className="font-headline text-2xl">
                                Device Authorization
                            </CardTitle>
                            <CardDescription>
                                Approve or block devices from performing scanning and inventory tasks.
                            </CardDescription>
                            </div>
                        </div>
                        <DialogTrigger asChild>
                            <Button onClick={() => setSelectedDevice(null)}>
                                <UserPlus className="mr-2"/>
                                Add Device
                            </Button>
                        </DialogTrigger>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Device</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>OTP Verified</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead>Last Used</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {devices.map(device => {
                                    const user = USERS.find(u => u.id === device.userId);
                                    return (
                                        <TableRow key={device.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <DeviceIcon type={device.deviceType} />
                                                    <div className="font-medium">{device.deviceName}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user?.username || 'Unknown User'}</TableCell>
                                            <TableCell>
                                                {device.verifiedByOTP ? 
                                                    <Badge variant="default" className="bg-green-500">Yes</Badge> : 
                                                    <Badge variant="destructive">No</Badge>
                                                }
                                            </TableCell>
                                            <TableCell>{format(new Date(device.createdAt), "PPP")}</TableCell>
                                            <TableCell>{format(new Date(device.lastUsedAt), "PPP p")}</TableCell>
                                            <TableCell><StatusBadge status={device.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onSelect={() => { setSelectedDevice(device); setIsFormOpen(true); }}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        {device.status !== 'approved' && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(device.id, 'approved')}>
                                                                <Check className="mr-2 h-4 w-4" /> Approve
                                                            </DropdownMenuItem>
                                                        )}
                                                        {device.status !== 'blocked' && (
                                                            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleUpdateStatus(device.id, 'blocked')}>
                                                                <X className="mr-2 h-4 w-4" /> Block
                                                            </DropdownMenuItem>
                                                        )}
                                                         <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>This will permanently delete the device "{device.deviceName}".</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteDevice(device.id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedDevice ? "Edit" : "Add New"} Device</DialogTitle>
                        <DialogDescription>
                            {selectedDevice ? `Editing details for ${selectedDevice.deviceName}` : "Fill in the form to register a new scanning device."}
                        </DialogDescription>
                    </DialogHeader>
                    <DeviceForm device={selectedDevice} onSave={handleSaveDevice} onFinished={() => setIsFormOpen(false)} />
                </DialogContent>
            </Dialog>
        </PEMSDashboard>
    );
}
