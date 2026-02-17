
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, MoreVertical, Smartphone, Tablet, Monitor, X, CircleHelp, UserPlus, Edit, Trash2, ShieldCheck, Mail, ShieldAlert } from "lucide-react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import PEMSDashboard from "@/components/pems-dashboard";
import { mockDevices, USERS, DEVICE_TYPES } from "@/lib/mock-data";
import { deviceFormSchema } from "@/lib/schemas";
import type { Device, DeviceStatus, DeviceType } from "@/types";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const statusConfig: Record<DeviceStatus, { color: string; label: string; icon: React.ElementType }> = {
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending", icon: CircleHelp },
    verified: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Verified", icon: ShieldCheck },
    approved: { color: "bg-green-100 text-green-800 border-green-200", label: "Approved", icon: ShieldCheck },
    blocked: { color: "bg-red-100 text-red-800 border-red-200", label: "Blocked", icon: ShieldAlert },
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
            imei: device.identifier,
            email: device.email || '',
            phone: device.phone || '',
        } : {
            deviceName: "",
            imei: "",
            email: "",
            phone: "",
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
                    name="imei"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>IMEI</FormLabel>
                            <FormControl><Input placeholder="e.g., 3545..." {...field} /></FormControl>
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Email for OTP</FormLabel>
                                <FormControl><Input placeholder="user@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Phone for OTP</FormLabel>
                                <FormControl><Input placeholder="e.g., 0771234567" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="space-y-1">
                    <Label>IP Address</Label>
                    <Input value="192.168.1.100 (auto-captured)" readOnly disabled />
                    <p className="text-xs text-muted-foreground">The device's IP address is captured automatically.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">Save Device</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

function OtpForm({ onVerify, onFinished }: { onVerify: (otp: string) => void, onFinished: () => void }) {
    const [otp, setOtp] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onVerify(otp);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Input 
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                autoFocus
            />
            <DialogFooter>
                <Button variant="ghost" type="button" onClick={onFinished}>Cancel</Button>
                <Button type="submit">Verify Device</Button>
            </DialogFooter>
        </form>
    );
}

export default function ScanningDevicesPage() {
    const { toast } = useToast();
    const [devices, setDevices] = React.useState<Device[]>(mockDevices);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
    const [isOtpDialogOpen, setIsOtpDialogOpen] = React.useState(false);
    const [deviceForOtp, setDeviceForOtp] = React.useState<Device | null>(null);

    const handleUpdateStatus = (deviceId: string, newStatus: DeviceStatus) => {
        const deviceToUpdate = devices.find(d => d.id === deviceId);
        if (!deviceToUpdate) return;
        
        setDevices(prevDevices => 
            prevDevices.map(device => 
                device.id === deviceId ? { ...device, status: newStatus } : device
            )
        );

        toast({
            title: `Device ${newStatus}`,
            description: `Device "${deviceToUpdate.deviceName}" has been ${newStatus}.`,
        });
    };

    const handleVerifyDevice = (otp: string) => {
        if (!deviceForOtp) return;
        
        if (otp.length === 6 && /^\d+$/.test(otp)) {
            setDevices(prevDevices => 
                prevDevices.map(device => 
                    device.id === deviceForOtp.id 
                        ? { ...device, status: 'verified', verifiedByOTP: true } 
                        : device
                )
            );
            
            toast({
                title: `Device Verified`,
                description: `Device "${deviceForOtp.deviceName}" is now verified and awaits admin approval.`,
            });
            
            setIsOtpDialogOpen(false);
            setDeviceForOtp(null);
        } else {
            toast({
                variant: "destructive",
                title: "Invalid OTP",
                description: "Please enter a valid 6-digit OTP.",
            });
        }
    };

    const handleSaveDevice = (data: z.infer<typeof deviceFormSchema>, deviceId?: string) => {
        if (deviceId) {
            // Update existing device
            setDevices(devices.map(d => d.id === deviceId ? { ...d, ...data, userId: parseInt(data.userId), deviceType: data.deviceType as DeviceType, identifier: data.imei } : d));
            toast({ title: 'Device Updated', description: `Device "${data.deviceName}" has been updated.` });
        } else {
            // Add new device
            const newDevice: Device = {
                id: `dev-${Date.now()}`,
                userId: parseInt(data.userId),
                deviceName: data.deviceName,
                deviceType: data.deviceType as DeviceType,
                identifier: data.imei,
                ipAddress: '192.168.1.100', // Mock IP
                email: data.email || undefined,
                phone: data.phone || undefined,
                status: 'pending',
                verifiedByOTP: false,
                approvedByAdmin: false,
                createdAt: new Date().toISOString(),
                lastUsedAt: new Date().toISOString(),
            };
            setDevices(prev => [newDevice, ...prev]);
            toast({ title: 'Device Added & OTP Sent', description: `Device "${data.deviceName}" is pending verification. An OTP has been sent to ${data.email || data.phone}.` });
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
                                    <TableHead>IMEI / IP Address</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
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
                                                <div className="font-mono text-xs">{device.identifier}</div>
                                                <div className="text-xs text-muted-foreground">{device.ipAddress}</div>
                                            </TableCell>
                                            <TableCell>{device.email || 'N/A'}</TableCell>
                                            <TableCell>{device.phone || 'N/A'}</TableCell>
                                            <TableCell>
                                                {device.verifiedByOTP ? 
                                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Yes</Badge> : 
                                                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">No</Badge>
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
                                                        <DropdownMenuSeparator />
                                                        {device.status === 'pending' && !device.verifiedByOTP && (
                                                            <DropdownMenuItem onSelect={() => { setDeviceForOtp(device); setIsOtpDialogOpen(true); }}>
                                                                <Mail className="mr-2 h-4 w-4" /> Send & Verify OTP
                                                            </DropdownMenuItem>
                                                        )}
                                                        {device.status === 'verified' && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(device.id, 'approved')}>
                                                                <Check className="mr-2 h-4 w-4" /> Approve
                                                            </DropdownMenuItem>
                                                        )}
                                                        {device.status !== 'blocked' && (
                                                            <DropdownMenuItem className="text-orange-500 focus:text-orange-500" onClick={() => handleUpdateStatus(device.id, 'blocked')}>
                                                                <X className="mr-2 h-4 w-4" /> Block
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
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

            <Dialog open={isOtpDialogOpen} onOpenChange={(open) => {
                if (!open) setDeviceForOtp(null);
                setIsOtpDialogOpen(open);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Device: {deviceForOtp?.deviceName}</DialogTitle>
                        <DialogDescription>
                            An OTP would be sent to {deviceForOtp?.email || deviceForOtp?.phone}. 
                            Enter the code below to complete verification. (For demo, any 6 digits work).
                        </DialogDescription>
                    </DialogHeader>
                    <OtpForm onVerify={handleVerifyDevice} onFinished={() => setIsOtpDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </PEMSDashboard>
    );
}

    

    

    

    