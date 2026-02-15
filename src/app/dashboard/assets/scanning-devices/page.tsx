"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, MoreVertical, Smartphone, Tablet, Monitor, X, CircleHelp } from "lucide-react";
import { format } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import PEMSDashboard from "@/components/pems-dashboard";
import { mockDevices, mockUsers } from "@/lib/mock-data";
import type { Device } from "@/types";
import { cn } from "@/lib/utils";


const statusConfig: Record<Device['status'], { color: string; label: string; icon: React.ElementType }> = {
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending", icon: CircleHelp },
    verified: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Verified", icon: Check },
    approved: { color: "bg-green-100 text-green-800 border-green-200", label: "Approved", icon: Check },
    blocked: { color: "bg-red-100 text-red-800 border-red-200", label: "Blocked", icon: X },
};

const deviceIcons: Record<Device['deviceType'], React.ElementType> = {
    mobile: Smartphone,
    desktop: Monitor,
    scanner: Tablet,
};

function StatusBadge({ status }: { status: Device['status'] }) {
    const config = statusConfig[status];
    return <Badge variant="outline" className={cn("capitalize", config.color)}><config.icon className="mr-1 h-3 w-3"/>{config.label}</Badge>;
}

function DeviceIcon({ type }: { type: Device['deviceType'] }) {
    const Icon = deviceIcons[type];
    return <Icon className="h-5 w-5 text-muted-foreground"/>
}


export default function ScanningDevicesPage() {
    const { toast } = useToast();
    const [devices, setDevices] = React.useState<Device[]>(mockDevices);

    const handleUpdateStatus = (deviceId: string, newStatus: Device['status']) => {
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

  return (
    <PEMSDashboard initialRole={null}>
      <Card>
        <CardHeader>
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
                        const user = mockUsers.find(u => u.id === device.userId);
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
    </PEMSDashboard>
  );
}
