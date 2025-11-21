
"use client";

import * as React from "react";
import {
  FilePlus,
  Trash2,
  Paperclip,
  Edit,
  MoreVertical,
  DollarSign,
  ArrowLeft,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockPayments } from "@/lib/mock-data";
import type { Payment, UserRole } from "@/types";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import PEMSDashboard from "@/components/pems-dashboard";

function ItemActions({ item, type, role }: { item: any, type: string, role: UserRole | null }) {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    const handleAction = (action: 'edit' | 'attach' | 'delete' | 'view') => {
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
        }
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log(`Attaching ${file.name} to ${type} ${item.id}`);
            toast({ title: 'File Attached', description: `File "${file.name}" selected for attachment.` });
        }
    };

    return (
        <>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
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

export default function PaymentsPage() {
    const router = useRouter();
    const [payments] = React.useState<Payment[]>(mockPayments);
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
                                <CardTitle className="font-headline text-2xl">Payments</CardTitle>
                                <CardDescription>
                                    Record and track payments made against invoices.
                                </CardDescription>
                            </div>
                        </div>
                        {canCreate && (
                            <Button onClick={() => router.push('/dashboard/finance/payments/new')}>
                                <DollarSign className="mr-2" /> Record Payment
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Payment Date</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.invoiceNumber}</TableCell>
                                    <TableCell>{p.date}</TableCell>
                                    <TableCell>${p.amount.toFixed(2)}</TableCell>
                                    <TableCell>{p.method}</TableCell>
                                    <TableCell className="text-right"><ItemActions item={p} type="payments" role={role} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PEMSDashboard>
    )
}
