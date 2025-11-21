
"use client";

import * as React from "react";
import {
  FilePlus,
  Trash2,
  Paperclip,
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Receipt,
  FileText,
  Truck,
  ChevronDown,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockLPOs } from "@/lib/mock-data";
import type { LPO, FinancialStatus, UserRole } from "@/types";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import PEMSDashboard from "@/components/pems-dashboard";

const statusColors: Record<FinancialStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700",
    Approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
    Rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
    Paid: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
    "Partially Paid": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700",
    Delivered: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-700",
    Unpaid: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700",
};

const statusIcons: Record<FinancialStatus, React.ElementType> = {
    Pending: Clock,
    Approved: CheckCircle,
    Rejected: XCircle,
    Paid: DollarSign,
    "Partially Paid": DollarSign,
    Delivered: Truck,
    Unpaid: Clock,
};

function StatusBadge({ status }: { status: FinancialStatus }) {
  const Icon = statusIcons[status as keyof typeof statusIcons] || Clock;
  return (
    <Badge variant="outline" className={cn("capitalize", statusColors[status])}>
      <Icon className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  );
}

function ItemActions({ item, type, role, onStatusChange }: { item: any, type: string, role: UserRole | null, onStatusChange?: (id: string, status: 'Approved' | 'Rejected') => void }) {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    const handleAction = (action: 'edit' | 'attach' | 'delete' | 'invoice' | 'view' | 'approve' | 'reject') => {
        switch(action) {
            case 'view':
            case 'edit':
                router.push(`/dashboard/finance/${type}/${item.id}/edit`);
                break;
            case 'attach':
                fileInputRef.current?.click();
                break;
            case 'delete':
                toast({ variant: 'destructive', title: 'Deleted', description: `${type} ${item.number || item.invoiceNumber} deleted.`});
                break;
            case 'invoice':
                router.push(`/dashboard/finance/invoices/new`);
                break;
        }
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log(`Attaching ${file.name} to ${type} ${item.id}`);
            toast({ title: 'File Attached', description: `File "${file.name}" selected for attachment.` });
        }
    };
    
    const canIssueInvoice = type === 'lpos' && item.status === 'Delivered';


    return (
        <>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction('view')}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('edit')}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                     {canIssueInvoice && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAction('invoice')}>
                              <Receipt className="mr-2 h-4 w-4" />
                              <span>Issue Invoice</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem onClick={() => handleAction('attach')}>
                        <Paperclip className="mr-2 h-4 w-4" />
                        <span>Attach File</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleAction('delete')}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default function LPOsPage() {
    const router = useRouter();
    const [lpos] = React.useState<LPO[]>(mockLPOs);
    const [role, setRole] = React.useState<UserRole | null>(null);

    React.useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as UserRole | null;
        if (storedRole) {
          setRole(storedRole);
        }
    }, []);

    const canCreate = role === 'Finance Manager' || role === 'Director';

    return (
        <PEMSDashboard initialRole="Finance Manager">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <Button asChild variant="outline" size="icon">
                                <Link href="/dashboard/finance"><ArrowLeft className="h-4 w-4" /></Link>
                            </Button>
                            <div>
                                <CardTitle className="font-headline text-2xl">Local Purchase Orders (LPOs)</CardTitle>
                                <CardDescription>
                                    Track LPOs converted from approved quotations.
                                </CardDescription>
                            </div>
                        </div>
                        {canCreate && (
                             <Button onClick={() => router.push('/dashboard/finance/lpos/new')}>
                                <FileText className="mr-2" /> Issue LPO
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lpos.map((lpo) => (
                                <TableRow key={lpo.id}>
                                    <TableCell className="font-medium">{lpo.number}</TableCell>
                                    <TableCell>{lpo.client}</TableCell>
                                    <TableCell>{lpo.date}</TableCell>
                                    <TableCell>${lpo.amount.toFixed(2)}</TableCell>
                                    <TableCell><StatusBadge status={lpo.status} /></TableCell>
                                    <TableCell className="text-right"><ItemActions item={lpo} type="lpos" role={role} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PEMSDashboard>
    )
}
