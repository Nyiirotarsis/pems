

"use client";

import * as React from "react";
import {
  Package,
  PackageSearch,
  ArrowRightLeft,
  ChevronDown,
  Warehouse,
  FileText,
  User,
  BotMessageSquare,
  Loader2,
  PackagePlus,
  Calendar as CalendarIcon,
  Search,
  Bell,
  Check,
  LogOut,
  Landmark,
  Wrench,
  ClipboardCheck,
  PlusCircle,
  BarChart,
  PieChartIcon,
  UserCheck,
  ChevronRight,
  MoreVertical,
  Users,
} from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FinanceModule } from "@/components/finance-module";

import { cn } from "@/lib/utils";
import { initialInventory, ROLES, CONDITIONS, mockKpis, mockUsers, assetCategories, mockAttendance, mockFieldPaymentRequests, mockFieldStaff, mockQuotations, mockLPOs, mockInvoices, mockPayments } from "@/lib/mock-data";
import type { UserRole, InventoryItem, Condition, AppNotification, Asset, Kpi, AttendanceRecord, AttendanceStatus, KpiStatus, FieldPaymentRequest, FieldPaymentStatus, Quotation, LPO, Invoice, Payment, FinancialStatus } from "@/types";
import { PacificEventsLogo } from "@/components/icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isWithinInterval } from "date-fns";


import {
  Bar,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  BarChart as RechartsBarChart,
} from "recharts";

import { handleSuggestOutsourcing } from "@/app/actions";
import type { SuggestOutsourcingOptionsOutput } from "@/ai/flows/suggest-outsourcing-options";

import { useToast } from "@/hooks/use-toast";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type View = "inventory" | "assets" | "transactions" | "requests" | "reports" | "notifications" | "finance" | "kpi" | "attendance";

const permissions: Record<UserRole, View[]> = {
  "Store Manager": ["inventory", "assets", "transactions", "requests", "reports", "notifications", "kpi", "attendance"],
  "Finance Manager": ["finance", "requests", "reports", "notifications", "kpi", "attendance"],
  "HR/Admin": ["reports", "notifications", "kpi", "attendance"],
  "CEO": ["inventory", "assets", "transactions", "requests", "reports", "notifications", "finance", "kpi", "attendance"],
  "Director": ["inventory", "assets", "transactions", "requests", "reports", "notifications", "finance", "kpi", "attendance"],
  "IT Managers": ["inventory", "assets", "transactions", "notifications", "requests", "kpi"],
};

const navItems: Record<
  View,
  { label: string; icon: React.ElementType; forRoles: UserRole[] }
> = {
  inventory: {
    label: "Inventory",
    icon: PackageSearch,
    forRoles: ["Store Manager", "CEO", "IT Managers", "Director"],
  },
  assets: {
      label: "Assets",
      icon: Wrench,
      forRoles: ["Store Manager", "CEO", "IT Managers", "Director"],
  },
  transactions: {
    label: "Issue / Return",
    icon: ArrowRightLeft,
    forRoles: ["Store Manager", "IT Managers", "Director"],
  },
  requests: {
    label: "Requests",
    icon: BotMessageSquare,
    forRoles: ["Store Manager", "Finance Manager", "CEO", "IT Managers", "Director"],
  },
  kpi: {
    label: "KPI Tracker",
    icon: ClipboardCheck,
    forRoles: ["Store Manager", "Finance Manager", "HR/Admin", "CEO", "Director", "IT Managers"],
  },
  attendance: {
    label: "Attendance",
    icon: UserCheck,
    forRoles: ["Store Manager", "CEO", "Director", "HR/Admin", "Finance Manager"],
  },
  finance: {
    label: "Finance",
    icon: Landmark,
    forRoles: ["Finance Manager", "CEO", "Director"],
  },
  reports: {
    label: "Reports",
    icon: FileText,
    forRoles: ["Store Manager", "Finance Manager", "HR/Admin", "CEO", "Director"],
  },
  notifications: {
      label: "Notifications",
      icon: Bell,
      forRoles: ["Store Manager", "CEO", "Director", "Finance Manager", "HR/Admin", "IT Managers"],
  }
};

const transactionFormSchema = z.object({
  equipmentId: z.string().min(1, "Please select an equipment."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  date: z.date(),
  condition: z.string().optional(),
});

const restockFormSchema = z.object({
  equipmentId: z.string().min(1, "Please select an equipment."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  receivedBy: z.string().min(2, "Please enter who received the items."),
});

const requestFormSchema = z.object({
  item: z.string().min(1, "Please enter an item name."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});

const kpiFormSchema = z.object({
    userId: z.string().min(1, "Please select a user."),
    category: z.string().min(2, "Category is required."),
    activityName: z.string().min(2, "Activity name is required."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    frequency: z.enum(["Daily", "Weekly", "Monthly", "Quarterly"]),
    startDate: z.date(),
    endDate: z.date(),
});

const attendanceFormSchema = z.object({
    userId: z.string().min(1, "Please select a user."),
    date: z.date(),
    status: z.enum(["Present", "Absent", "Late", "On Leave"], { required_error: "Please select a status."}),
    notes: z.string().optional(),
});

const fieldPaymentRequestSchema = z.object({
    staffId: z.string().min(1, "Please select a staff member."),
    workDescription: z.string().min(5, "Please provide a brief work description."),
    daysWorked: z.coerce.number().min(0.5, "Please enter a valid number of days."),
    rate: z.coerce.number().min(1, "Please enter a valid rate."),
    requestDate: z.date(),
})


export default function PEMSDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [activeView, setActiveView] = React.useState<View>("inventory");
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialInventory);
  const [kpis, setKpis] = React.useState<Kpi[]>(mockKpis);
  const [attendance, setAttendance] = React.useState<AttendanceRecord[]>(mockAttendance);
  const [fieldPayments, setFieldPayments] = React.useState<FieldPaymentRequest[]>(mockFieldPaymentRequests);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  
  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (!storedRole || !ROLES.includes(storedRole)) {
      router.push("/login");
    } else {
      setRole(storedRole);
      // Set initial view based on role
      if (permissions[storedRole].length > 0) {
        setActiveView(permissions[storedRole][0]);
      }
    }
  }, [router]);

  const getInventoryTotals = (item: InventoryItem) => {
    const total = item.assets.length;
    const available = item.assets.filter(a => a.status === 'Available' && a.condition === 'Good').length;
    const issued = item.assets.filter(a => a.status === 'Issued').length;
    const faulty = item.assets.filter(a => a.condition === 'Faulty').length;
    return { total, available, issued, faulty };
  };
  
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(item => ({
    ...item,
    ...getInventoryTotals(item)
  }));
  
  const handleViewChange = (view: View) => {
    if (role && permissions[role].includes(view)) {
        if (view === 'assets') {
            router.push('/dashboard/assets');
        } else {
            setActiveView(view);
        }
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
    // If the current view is not available for the new role, switch to the first available view
    if (!permissions[newRole].includes(activeView)) {
      setActiveView(permissions[newRole][0]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const updateInventory = (
    equipmentId: number,
    quantity: number,
    type: "issue" | "return" | "restock",
    condition?: Condition
  ) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) => {
        if (item.id === equipmentId) {
            let updatedAssets = [...item.assets];
            if(type === 'restock') {
                const namePrefix = item.name.substring(0, 3).toUpperCase();
                const lastAssetIdNum = item.assets.length > 0 ? parseInt(item.assets[item.assets.length - 1].id.split('-').pop() || '0') : 0;

                for (let i = 1; i <= quantity; i++) {
                    const newAsset: Asset = {
                        id: `${namePrefix}-${item.id}-${String(lastAssetIdNum + i).padStart(4, '0')}`,
                        equipmentId: item.id,
                        condition: 'Good',
                        status: 'Available',
                        purchaseDate: new Date().toISOString().split("T")[0],
                    };
                    updatedAssets.push(newAsset);
                }
            } else if (type === 'issue') {
                const availableAssets = updatedAssets.filter(a => a.status === 'Available' && a.condition === 'Good').slice(0, quantity);
                availableAssets.forEach(a => {
                    const asset = updatedAssets.find(ua => ua.id === a.id);
                    if (asset) {
                        asset.status = 'Issued';
                        asset.assignedTo = role || 'Unknown'; // Assign to current role for demo
                    }
                });
            } else if (type === 'return') {
                 // This part needs more specific logic, for now we just assume a generic return.
                 // We'd need to know *which* assets are being returned to update them properly.
                 // For now, let's find issued assets and mark them as available.
                 const issuedAssets = updatedAssets.filter(a => a.status === 'Issued').slice(0, quantity);
                 issuedAssets.forEach(a => {
                    const asset = updatedAssets.find(ua => ua.id === a.id);
                    if (asset) {
                        asset.status = 'Available';
                        asset.condition = condition || 'Good';
                        delete asset.assignedTo;
                    }
                });
            }

            return {
                ...item,
                assets: updatedAssets,
                lastUpdated: new Date().toISOString().split("T")[0],
            };
        }
        return item;
      })
    );
  };
  
  const addKpi = (values: z.infer<typeof kpiFormSchema>) => {
      const newKpi: Kpi = {
          id: Date.now(),
          userId: parseInt(values.userId),
          ...values,
          startDate: format(values.startDate, "yyyy-MM-dd"),
          endDate: format(values.endDate, "yyyy-MM-dd"),
          status: 'Pending',
      };
      setKpis(prev => [newKpi, ...prev]);
      toast({
        title: "KPI Added",
        description: `A new KPI "${values.activityName}" has been added.`,
      })
  }

  const completeKpi = (kpiId: number) => {
    setKpis(prev => prev.map(kpi => 
        kpi.id === kpiId 
        ? { ...kpi, status: 'Completed', finishedDate: format(new Date(), "yyyy-MM-dd") } 
        : kpi
    ));
    toast({
        title: "KPI Completed",
        description: `The KPI has been marked as completed.`
    });
  }


  const addAttendanceRecord = (values: z.infer<typeof attendanceFormSchema>) => {
    const newRecord: AttendanceRecord = {
        id: Date.now(),
        userId: parseInt(values.userId),
        date: format(values.date, "yyyy-MM-dd"),
        status: values.status,
        notes: values.notes,
    };
    setAttendance(prev => [newRecord, ...prev]);
    toast({
        title: "Attendance Recorded",
        description: `Attendance for ${mockUsers.find(u => u.id.toString() === values.userId)?.username} on ${format(values.date, "PPP")} has been logged as ${values.status}.`,
    });
  };

  const addFieldPaymentRequest = (values: z.infer<typeof fieldPaymentRequestSchema>) => {
    const staffMember = mockFieldStaff.find(s => s.id === parseInt(values.staffId));
    if (!staffMember) return;

    const newRequest: FieldPaymentRequest = {
        id: fieldPayments.length + 1,
        staffId: parseInt(values.staffId),
        staffName: staffMember.name,
        workDescription: values.workDescription,
        daysWorked: values.daysWorked,
        rate: values.rate,
        totalAmount: values.daysWorked * values.rate,
        status: 'Pending',
        requestDate: format(values.requestDate, "yyyy-MM-dd"),
    };
    setFieldPayments(prev => [newRequest, ...prev]);
    addNotification(`New payment request for ${staffMember.name} (UGX ${newRequest.totalAmount.toLocaleString()}) needs approval.`, ['Finance Manager']);
    toast({
        title: "Payment Request Submitted",
        description: `Requisition for ${staffMember.name} has been sent to Finance.`,
    });
  };

  const updateFieldPaymentStatus = (id: number, status: FieldPaymentStatus) => {
    setFieldPayments(prev => prev.map(p => {
      if (p.id === id) {
        const updatedPayment = { ...p, status };
        if (status === 'Paid') {
          updatedPayment.paymentDate = format(new Date(), "yyyy-MM-dd");
          addNotification(`Payment for ${p.staffName} has been processed. Please acknowledge and upload receipt.`, ['CEO']);
        }
        if (status === 'Acknowledged') {
            // In a real app, this would trigger a file upload dialog
             updatedPayment.receiptFile = 'receipt_placeholder.pdf';
             addNotification(`CEO has acknowledged payment for ${p.staffName}.`, ['Finance Manager']);
        }
        return updatedPayment;
      }
      return p;
    }));
  };


  const addNotification = (message: string, forRoles: UserRole[]) => {
    const newNotification: AppNotification = {
      id: Date.now(),
      message,
      date: new Date().toISOString(),
      read: false,
      forRoles,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  if (!role) {
    // You can render a loading spinner here while checking for authentication
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.forRoles.includes(role) && !n.read).length;

  const directorNav = (
    <>
      <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <Package />
              <span>Operations</span>
            </div>
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubButton onClick={() => handleViewChange("inventory")} isActive={activeView === "inventory"}>Inventory</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => handleViewChange("assets")} isActive={activeView === "assets"}>Assets</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => handleViewChange("transactions")} isActive={activeView === "transactions"}>Issue / Return</SidebarMenuSubButton>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
            <SidebarMenuButton className="justify-between">
                <div className="flex items-center gap-2">
                <ClipboardCheck />
                <span>Planning</span>
                </div>
                <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubButton onClick={() => handleViewChange("requests")} isActive={activeView === "requests"}>Requests</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => handleViewChange("kpi")} isActive={activeView === "kpi"}>KPI Tracker</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => handleViewChange("attendance")} isActive={activeView === "attendance"}>Attendance</SidebarMenuSubButton>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>

      {['finance', 'reports', 'notifications'].map(key => {
        const viewKey = key as View;
        const item = navItems[viewKey];
        if (item.forRoles.includes(role)) {
          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                onClick={() => handleViewChange(viewKey)}
                isActive={activeView === key}
              >
                <item.icon />
                <span>{item.label}</span>
                {key === 'notifications' && unreadCount > 0 && (
                  <Badge className="ml-auto">{unreadCount}</Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
        return null;
      })}
    </>
  );

  const defaultNav = (
    <>
      {Object.entries(navItems).map(([key, item]) => {
        const viewKey = key as View;
        if (item.forRoles.includes(role)) {
          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                onClick={() => handleViewChange(viewKey)}
                isActive={activeView === key}
              >
                <item.icon />
                <span>{item.label}</span>
                {key === 'notifications' && unreadCount > 0 && (
                  <Badge className="ml-auto">{unreadCount}</Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
        return null;
      })}
    </>
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-3">
            <PacificEventsLogo className="size-10" />
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-semibold">Pacific Events</h2>
              <p className="text-xs text-muted-foreground">Event Management System</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {role === 'Director' ? directorNav : defaultNav}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 rounded-lg border p-2">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${role.replace(/\s/g, "")}`} />
              <AvatarFallback>{role.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm flex-1">
                <Select value={role} onValueChange={(v) => handleRoleChange(v as UserRole)}>
                  <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 shadow-none font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <span className="text-xs text-muted-foreground">Viewing as {role}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0">
                <LogOut className="size-4" />
                <span className="sr-only">Log Out</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <header className="flex items-center justify-between mb-6">
            <h1 className="font-headline text-3xl font-semibold capitalize">
              {activeView}
            </h1>
            <SidebarTrigger className="md:hidden" />
          </header>
          <main>
            {activeView === "inventory" && (
              <InventoryView 
                inventory={filteredInventory} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRestock={(values) => {
                  const equipmentId = parseInt(values.equipmentId);
                  updateInventory(equipmentId, values.quantity, "restock");
                  toast({
                    title: "Success",
                    description: `${values.quantity} units of ${inventory.find(i => i.id === equipmentId)?.name} restocked by ${values.receivedBy}.`,
                  });
                }}
              />
            )}
            {activeView === "transactions" && (
              <TransactionsView 
                inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} 
                onIssue={(values) => {
                  const equipmentId = parseInt(values.equipmentId);
                  updateInventory(equipmentId, values.quantity, "issue");
                  toast({
                    title: "Success",
                    description: `${values.quantity} units of ${inventory.find(i => i.id === equipmentId)?.name} issued.`,
                  });
                }}
                onReturn={(values) => {
                  const equipmentId = parseInt(values.equipmentId);
                  updateInventory(equipmentId, values.quantity, "return", values.condition as Condition);
                   toast({
                    title: "Success",
                    description: `${values.quantity} units of ${inventory.find(i => i.id === equipmentId)?.name} returned in ${values.condition} condition.`,
                  });
                }}
              />
            )}
            {activeView === "requests" && <RequestsView role={role} inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} onNotify={addNotification} />}
            {activeView === "kpi" && <KpiTrackerView kpis={kpis} onAddKpi={addKpi} onCompleteKpi={completeKpi} />}
            {activeView === "attendance" && <AttendanceView attendance={attendance} onAddRecord={addAttendanceRecord} role={role} fieldPayments={fieldPayments} onAddFieldPayment={addFieldPaymentRequest} onUpdateFieldPaymentStatus={updateFieldPaymentStatus} />}
            {activeView === "finance" && <FinanceModule role={role} />}
            {activeView === "reports" && <ReportsView inventory={inventory} role={role} quotations={mockQuotations} lpos={mockLPOs} invoices={mockInvoices} payments={mockPayments} />}
            {activeView === "notifications" && (
                <NotificationsView
                    notifications={notifications.filter(n => n.forRoles.includes(role))}
                    onMarkAsRead={markNotificationAsRead}
                />
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function InventoryView({ inventory, searchQuery, setSearchQuery, onRestock }: { inventory: (InventoryItem & { available: number; total: number; faulty: number; })[], searchQuery: string, setSearchQuery: (q: string) => void, onRestock: (values: z.infer<typeof restockFormSchema>) => void }) {
  const form = useForm<z.infer<typeof restockFormSchema>>({
    resolver: zodResolver(restockFormSchema),
    defaultValues: { quantity: 1, receivedBy: "" },
  });

  function onSubmit(values: z.infer<typeof restockFormSchema>) {
    onRestock(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="font-headline">Current Stock</CardTitle>
            <CardDescription>Search and view items in the database.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                className="w-full sm:w-[250px] pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PackagePlus className="mr-2 h-4 w-4" /> Restock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">Restock Inventory</DialogTitle>
                  <DialogDescription>Add new serialized assets to the inventory.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="equipmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select equipment to restock" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inventory.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                  {item.name}
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
                      name="receivedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Received By</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button type="button">Log Restock</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will add {form.getValues().quantity} new asset(s) to the inventory.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-center">Faulty</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">
                     <Badge variant={item.available > 0 ? "default" : "destructive"} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {item.available}
                     </Badge>
                  </TableCell>
                   <TableCell className="text-center">
                     <Badge variant={item.faulty > 0 ? "destructive" : "outline"} className={cn(item.faulty > 0 && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200")}>
                        {item.faulty}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-center">{item.total}</TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No items match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TransactionsView({ inventory, onIssue, onReturn }: { inventory: (InventoryItem & { available: number; total: number; })[], onIssue: (v: any) => void, onReturn: (v: any) => void }) {
  const issueForm = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: { quantity: 1, date: new Date() },
  });

  const returnForm = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: { quantity: 1, date: new Date() },
  });

  function handleIssueSubmit(values: z.infer<typeof transactionFormSchema>) {
    const item = inventory.find(i => i.id === parseInt(values.equipmentId));
    if (item && item.available < values.quantity) {
      issueForm.setError("quantity", { type: "manual", message: `Not enough in stock. Only ${item.available} available.`});
      return;
    }
    onIssue(values);
    issueForm.reset({ quantity: 1, date: new Date() });
  }

  function handleReturnSubmit(values: z.infer<typeof transactionFormSchema>) {
    onReturn(values);
    returnForm.reset({ quantity: 1, date: new Date() });
  }
  
  return (
    <Tabs defaultValue="issue">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="issue">Issue Equipment</TabsTrigger>
        <TabsTrigger value="return">Return Equipment</TabsTrigger>
      </TabsList>
      <TabsContent value="issue">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Issue Equipment</CardTitle>
            <CardDescription>Record items taken by staff for events.</CardDescription>
          </CardHeader>
          <Form {...issueForm}>
            <form onSubmit={issueForm.handleSubmit(handleIssueSubmit)}>
              <CardContent className="space-y-4">
                <TransactionFormFields form={issueForm} inventory={inventory} type="issue" />
              </CardContent>
              <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">Issue Item</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will mark {issueForm.getValues().quantity} item(s) as issued.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={issueForm.handleSubmit(handleIssueSubmit)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="return">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Return Equipment</CardTitle>
            <CardDescription>Log items returned and update their condition.</CardDescription>
          </CardHeader>
          <Form {...returnForm}>
            <form onSubmit={returnForm.handleSubmit(handleReturnSubmit)}>
              <CardContent className="space-y-4">
                <TransactionFormFields form={returnForm} inventory={inventory} type="return" />
              </CardContent>
              <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">Receive Item</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will return {returnForm.getValues().quantity} item(s) to the inventory.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={returnForm.handleSubmit(handleReturnSubmit)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function TransactionFormFields({ form, inventory, type }: { form: any, inventory: (InventoryItem & { available: number; total: number; })[], type: 'issue' | 'return' }) {
  return (
    <>
      <FormField
        control={form.control}
        name="equipmentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipment</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {inventory.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} (Available: {item.available})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{type === 'issue' ? 'Date Out' : 'Date In'}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {type === "return" && (
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select returned condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

function RequestsView({ inventory, onNotify, role }: { inventory: (InventoryItem & { available: number; total: number; })[], onNotify: (message: string, roles: UserRole[]) => void, role: UserRole | null }) {
  const [isPending, startTransition] = useTransition();
  const [aiResponse, setAiResponse] = React.useState<SuggestOutsourcingOptionsOutput | null>(null);
  const [inStock, setInStock] = React.useState<boolean | null>(null);
  const [outOfStockMessage, setOutOfStockMessage] = React.useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: { item: "", quantity: 1 },
  });

  function onSubmit(values: z.infer<typeof requestFormSchema>) {
    setAiResponse(null);
    setInStock(null);
    setOutOfStockMessage(null);
    
    const notificationRoles: UserRole[] = ["CEO", "Director", "Finance Manager", "HR/Admin", "IT Managers"];
    onNotify(`A request was made for ${values.quantity} of "${values.item}".`, notificationRoles);

    const requestedItem = inventory.find(
      (item) => item.name.toLowerCase() === values.item.toLowerCase()
    );

    if (requestedItem && requestedItem.available >= values.quantity) {
      setInStock(true);
    } else {
      setInStock(false);
      const availableCount = requestedItem?.available || 0;
      if (role === 'Store Manager' || role === 'IT Managers') {
          setOutOfStockMessage(`The number of available equipment is ${availableCount}, which is less than requested. Please contact the Finance Manager for outsourcing.`);
      } else {
        startTransition(async () => {
          try {
            const response = await handleSuggestOutsourcing({ item: values.item, quantity: values.quantity });
            if (response.suggestions && response.suggestions.length > 0) {
              setAiResponse(response);
            } else {
              setOutOfStockMessage("This item is unavailable, and we could not fetch outsourcing suggestions at this time. Please contact the Finance Manager directly.");
            }
          } catch(e) {
             toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred while fetching suggestions.",
            });
          }
        });
      }
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Request Item</CardTitle>
        <CardDescription>Check item availability. If unavailable, get AI-powered outsourcing options.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="item"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Projector" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <span>Check Availability</span>
            </Button>
            {isPending && (
              <div className="text-sm text-muted-foreground flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking stock and searching for outsourcing options...
              </div>
            )}
            {inStock === true && (
              <Card className="w-full bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Available In Stock!
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-400">
                    This item is available for reservation. Please proceed through the standard issue process.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {outOfStockMessage && (
                 <Card className="w-full bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
                    <CardHeader>
                        <CardTitle className="text-orange-800 dark:text-orange-300 flex items-center gap-2">
                            <PackageSearch className="h-5 w-5" />
                            Insufficient Stock
                        </CardTitle>
                        <CardDescription className="text-orange-700 dark:text-orange-400">
                           {outOfStockMessage}
                        </CardDescription>
                    </CardHeader>
                 </Card>
            )}
            {aiResponse && aiResponse.suggestions.length > 0 && (
               <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BotMessageSquare className="h-5 w-5 text-primary" />
                    Outsourcing Plan
                  </CardTitle>
                  <CardDescription>This item is unavailable. Here is a suggested outsourcing plan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiResponse.suggestions.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{s.source}</TableCell>
                          <TableCell>{s.equipment}</TableCell>
                          <TableCell className="text-center">{s.quantity}</TableCell>
                          <TableCell className="text-right font-medium">{s.cost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function KpiTrackerView({ kpis, onAddKpi, onCompleteKpi }: { kpis: Kpi[], onAddKpi: (values: z.infer<typeof kpiFormSchema>) => void, onCompleteKpi: (kpiId: number) => void }) {
    const form = useForm<z.infer<typeof kpiFormSchema>>({
        resolver: zodResolver(kpiFormSchema),
        defaultValues: {
            category: "",
            activityName: "",
            description: "",
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
    });

    const getUserDetails = (userId: number) => {
        const user = mockUsers.find(u => u.id === userId);
        return user ? { name: user.username, role: user.role } : { name: 'Unknown', role: 'Unknown' };
    }

    function onSubmit(values: z.infer<typeof kpiFormSchema>) {
        onAddKpi(values);
        form.reset();
    }

    const kpiStatusData = [
        { status: 'Pending', count: kpis.filter(k => k.status === 'Pending').length, fill: "hsl(var(--chart-5))" },
        { status: 'In Progress', count: kpis.filter(k => k.status === 'In Progress').length, fill: "hsl(var(--chart-3))" },
        { status: 'Completed', count: kpis.filter(k => k.status === 'Completed').length, fill: "hsl(var(--chart-2))" }
    ].filter(d => d.count > 0);
    
    const kpiStatusColors: Record<KpiStatus, string> = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
      "Completed": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
    }
    
    return (
      <div className="grid gap-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="font-headline">KPI Tracker</CardTitle>
                        <CardDescription>Define and monitor Key Performance Indicators for staff.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add KPI
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="font-headline">Add New KPI</DialogTitle>
                                <DialogDescription>Fill in the details for the new performance indicator.</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="userId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>User</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a user" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockUsers.map((user) => (
                                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                                {user.username} ({user.role})
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
                                        name="activityName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Activity Name</FormLabel>
                                                <FormControl><Input placeholder="e.g., Response Time" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Activity Category</FormLabel>
                                                <FormControl><Input placeholder="e.g., Customer Service" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>KPI Description</FormLabel>
                                                <FormControl><Textarea placeholder="Describe the KPI..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                      <FormField
                                          control={form.control}
                                          name="startDate"
                                          render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Start Date</FormLabel>
                                                  <Popover>
                                                      <PopoverTrigger asChild>
                                                      <FormControl>
                                                          <Button
                                                          variant={"outline"}
                                                          className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                                          {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                          </Button>
                                                      </FormControl>
                                                      </PopoverTrigger>
                                                      <PopoverContent className="w-auto p-0" align="start">
                                                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                                      </PopoverContent>
                                                  </Popover>
                                                  <FormMessage />
                                              </FormItem>
                                          )}
                                      />
                                       <FormField
                                          control={form.control}
                                          name="endDate"
                                          render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>End Date</FormLabel>
                                                  <Popover>
                                                      <PopoverTrigger asChild>
                                                      <FormControl>
                                                          <Button
                                                          variant={"outline"}
                                                          className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                                          {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                          </Button>
                                                      </FormControl>
                                                      </PopoverTrigger>
                                                      <PopoverContent className="w-auto p-0" align="start">
                                                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                                      </PopoverContent>
                                                  </Popover>
                                                  <FormMessage />
                                              </FormItem>
                                          )}
                                      />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="frequency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select frequency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["Daily", "Weekly", "Monthly", "Quarterly"].map(f => (
                                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button type="button">Save KPI</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will add a new KPI for the selected user.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Person</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Timeline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Finished Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {kpis.map((kpi) => {
                            const user = getUserDetails(kpi.userId);
                            return (
                                <TableRow key={kpi.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.role}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{kpi.activityName}</div>
                                        <div className="text-xs text-muted-foreground">{kpi.category}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="text-sm">{format(new Date(kpi.startDate), 'dd MMM')} - {format(new Date(kpi.endDate), 'dd MMM, yyyy')}</div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className={cn("capitalize", kpiStatusColors[kpi.status])}>{kpi.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      {kpi.finishedDate ? format(new Date(kpi.finishedDate), "PPP") : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                               <DropdownMenuItem onSelect={() => onCompleteKpi(kpi.id)} disabled={kpi.status === 'Completed'}>
                                                  <Check className="mr-2 h-4 w-4" />
                                                  Mark as Completed
                                               </DropdownMenuItem>
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
          <Card>
             <CardHeader>
                <CardTitle className="font-headline">KPI Status Overview</CardTitle>
                <CardDescription>A summary of the status of all assigned KPIs.</CardDescription>
            </CardHeader>
            <CardContent>
               <ChartContainer config={{}} className="min-h-[250px] w-full">
                    <RechartsBarChart data={kpiStatusData} layout="vertical" margin={{ left: 10, right: 30 }}>
                       <CartesianGrid horizontal={false} />
                       <XAxis type="number" hide />
                       <YAxis 
                         dataKey="status" 
                         type="category" 
                         tickLine={false} 
                         axisLine={false} 
                         tickMargin={10} 
                         width={80}
                       />
                       <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                       <Bar dataKey="count" radius={5}>
                          {kpiStatusData.map(d => <Cell key={d.status} fill={d.fill} />)}
                       </Bar>
                    </RechartsBarChart>
               </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}

function AttendanceView({ attendance, onAddRecord, role, fieldPayments, onAddFieldPayment, onUpdateFieldPaymentStatus }: { attendance: AttendanceRecord[], onAddRecord: (values: z.infer<typeof attendanceFormSchema>) => void, role: UserRole | null, fieldPayments: FieldPaymentRequest[], onAddFieldPayment: (values: z.infer<typeof fieldPaymentRequestSchema>) => void, onUpdateFieldPaymentStatus: (id: number, status: FieldPaymentStatus) => void; }) {
    const defaultTab = role === 'CEO' ? "field_payments" : "records";
    const paymentForm = useForm<z.infer<typeof fieldPaymentRequestSchema>>({
        resolver: zodResolver(fieldPaymentRequestSchema),
        defaultValues: {
            requestDate: new Date(),
            daysWorked: 1,
            rate: 0,
        },
    });
    
    function handlePaymentSubmit(values: z.infer<typeof fieldPaymentRequestSchema>) {
        onAddFieldPayment(values);
        paymentForm.reset({
            requestDate: new Date(),
            daysWorked: 1,
            rate: 0,
            staffId: undefined,
            workDescription: "",
        });
    }

    const isFinance = role === 'Finance Manager';

    const paymentStatusColors: Record<FieldPaymentStatus, string> = {
        Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
        Paid: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        Acknowledged: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    };
    
    const paymentByStaff = fieldPayments.reduce((acc, p) => {
        if (p.status === 'Paid' || p.status === 'Acknowledged') {
            acc[p.staffName] = (acc[p.staffName] || 0) + p.totalAmount;
        }
        return acc;
    }, {} as Record<string, number>);

    const paymentChartData = Object.entries(paymentByStaff).map(([name, amount]) => ({ name, amount }));


    return (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className={cn("grid w-full", role === 'CEO' || isFinance ? "grid-cols-3" : "grid-cols-2")}>
                <TabsTrigger value="records">Staff Attendance</TabsTrigger>
                <TabsTrigger value="log">Log Attendance</TabsTrigger>
                 {(role === 'CEO' || isFinance) && <TabsTrigger value="field_payments">Field Payments</TabsTrigger>}
            </TabsList>
            <TabsContent value="log">
                <StaffAttendanceLogForm onAddRecord={onAddRecord} />
            </TabsContent>
            <TabsContent value="records">
                <StaffAttendanceRecords attendance={attendance} />
            </TabsContent>
             {(role === 'CEO' || isFinance) && (
                <TabsContent value="field_payments">
                    <div className="grid gap-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div>
                                            <CardTitle className="font-headline">Field Staff Payments</CardTitle>
                                            <CardDescription>Create and track payment requisitions for casual workers.</CardDescription>
                                        </div>
                                        {role === 'CEO' &&
                                            <Dialog>
                                                <DialogTrigger asChild><Button><PlusCircle className="mr-2"/>New Request</Button></DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>New Field Payment Request</DialogTitle>
                                                        <DialogDescription>Fill in the details to send a payment requisition to finance.</DialogDescription>
                                                    </DialogHeader>
                                                     <Form {...paymentForm}>
                                                        <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                                                             <FormField
                                                                control={paymentForm.control}
                                                                name="staffId"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Staff Member</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a staff member" /></SelectTrigger></FormControl>
                                                                            <SelectContent>
                                                                                {mockFieldStaff.map((s) => (<SelectItem key={s.id} value={s.id.toString()}>{s.name} ({s.role})</SelectItem>))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={paymentForm.control}
                                                                name="workDescription"
                                                                render={({ field }) => (<FormItem><FormLabel>Work Description</FormLabel><FormControl><Input placeholder="e.g., Stage setup for Judiciary event" {...field} /></FormControl><FormMessage /></FormItem>)}
                                                            />
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <FormField control={paymentForm.control} name="daysWorked" render={({ field }) => (<FormItem><FormLabel>Days/Units</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                                <FormField control={paymentForm.control} name="rate" render={({ field }) => (<FormItem><FormLabel>Rate (UGX)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                                            </div>
                                                             <FormField
                                                                control={paymentForm.control}
                                                                name="requestDate"
                                                                render={({ field }) => (
                                                                    <FormItem className="flex flex-col">
                                                                    <FormLabel>Request Date</FormLabel>
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                                                            {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent>
                                                                    </Popover>
                                                                    <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <DialogFooter>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild><Button type="button">Submit Request</Button></AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>This will send a payment requisition to the finance department.</AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={paymentForm.handleSubmit(handlePaymentSubmit)}>Continue</AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </DialogFooter>
                                                        </form>
                                                     </Form>
                                                </DialogContent>
                                            </Dialog>
                                        }
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Staff</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Requested</TableHead><TableHead>Paid</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {fieldPayments.map(p => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="font-medium">{p.staffName}</TableCell>
                                                    <TableCell>{p.workDescription}</TableCell>
                                                    <TableCell>UGX {p.totalAmount.toLocaleString()}</TableCell>
                                                    <TableCell><Badge className={paymentStatusColors[p.status]}>{p.status}</Badge></TableCell>
                                                    <TableCell>{format(new Date(p.requestDate), 'PPP')}</TableCell>
                                                    <TableCell>{p.paymentDate ? format(new Date(p.paymentDate), 'PPP') : 'N/A'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                {isFinance && p.status === 'Pending' && <DropdownMenuItem onSelect={() => onUpdateFieldPaymentStatus(p.id, 'Paid')}>Mark as Paid</DropdownMenuItem>}
                                                                {role === 'CEO' && p.status === 'Paid' && <DropdownMenuItem onSelect={() => onUpdateFieldPaymentStatus(p.id, 'Acknowledged')}>Acknowledge & Upload Receipt</DropdownMenuItem>}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Payments by Staff</CardTitle><CardDescription>Total amounts paid out to field staff.</CardDescription></CardHeader>
                                <CardContent>
                                    <ChartContainer config={{}} className="min-h-[250px] w-full">
                                        <RechartsBarChart data={paymentChartData} layout="vertical" margin={{left: 20, right: 20}}>
                                            <CartesianGrid horizontal={false} />
                                            <XAxis type="number" dataKey="amount" tickFormatter={(val) => `UGX ${val/1000}k`} />
                                            <YAxis dataKey="name" type="category" width={80} />
                                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                                            <Bar dataKey="amount" fill="hsl(var(--chart-1))" radius={4} />
                                        </RechartsBarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
             )}
        </Tabs>
    );
}

function StaffAttendanceLogForm({ onAddRecord }: { onAddRecord: (values: z.infer<typeof attendanceFormSchema>) => void }) {
    const form = useForm<z.infer<typeof attendanceFormSchema>>({
        resolver: zodResolver(attendanceFormSchema),
        defaultValues: {
            date: new Date(),
            notes: "",
        },
    });

    function onSubmit(values: z.infer<typeof attendanceFormSchema>) {
        onAddRecord(values);
        form.reset({
            date: new Date(),
            userId: undefined,
            status: undefined,
            notes: "",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Log Daily Attendance</CardTitle>
                <CardDescription>Select the user and mark their attendance for the day.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a user" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mockUsers.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.username} ({user.role})
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
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                            <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="Present" id="s-present" />
                                        <Label htmlFor="s-present">Present</Label>
                                    </div>
                                        <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="Late" id="s-late" />
                                        <Label htmlFor="s-late">Late</Label>
                                    </div>
                                        <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="Absent" id="s-absent" />
                                        <Label htmlFor="s-absent">Absent</Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="On Leave" id="s-leave" />
                                        <Label htmlFor="s-leave">On Leave</Label>
                                    </div>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., Arrived late due to traffic" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button">Save Record</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will log the attendance record for the selected user.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

function StaffAttendanceRecords({ attendance }: { attendance: AttendanceRecord[] }) {
    const getUserDetails = (userId: number) => {
        return mockUsers.find(u => u.id === userId);
    };

    const statusColors: Record<AttendanceStatus, string> = {
        Present: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        Late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
        Absent: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
        "On Leave": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Attendance History</CardTitle>
                <CardDescription>A log of all recorded attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendance.map((record) => {
                            const user = getUserDetails(record.userId);
                            return (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="font-medium">{user?.username}</div>
                                        <div className="text-xs text-muted-foreground">{user?.role}</div>
                                    </TableCell>
                                    <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("capitalize", statusColors[record.status])} variant="outline">{record.status}</Badge>
                                    </TableCell>
                                    <TableCell>{record.notes || 'N/A'}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

function ReportsView({ inventory, role, quotations, lpos, invoices, payments }: ReportsViewProps) {
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('monthly');

  const getInventoryTotals = (item: InventoryItem) => {
    const total = item.assets.length;
    const available = item.assets.filter(a => a.status === 'Available' && a.condition === 'Good').length;
    const issued = item.assets.filter(a => a.status === 'Issued').length;
    const faulty = item.assets.filter(a => a.condition === 'Faulty').length;
    return { total, available, issued, faulty };
  };

  const inventoryWithTotals = inventory.map(item => ({
    ...item,
    ...getInventoryTotals(item)
  }));
  
  const totalItems = inventoryWithTotals.reduce((sum, item) => sum + item.total, 0);
  const totalAvailable = inventoryWithTotals.reduce((sum, item) => sum + item.available, 0);
  const mostStocked = inventoryWithTotals.reduce((max, item) => item.total > max.total ? item : max, inventoryWithTotals[0] || {name: "N/A", total: 0});
  const leastAvailable = inventoryWithTotals.reduce((min, item) => item.available < min.available ? item : min, inventoryWithTotals[0] || {name: "N/A", available: 0});

  const categoryTotals = assetCategories.map(category => {
    const total = inventory
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.assets.length, 0);
    return { name: category, value: total };
  }).filter(c => c.value > 0);

  // Financial chart data filtering
  const now = new Date();
  const dateRanges: Record<TimeFilter, Interval> = {
      daily: { start: subDays(now, 1), end: now },
      weekly: { start: startOfWeek(now), end: endOfWeek(now) },
      monthly: { start: startOfMonth(now), end: endOfMonth(now) },
      quarterly: { start: startOfQuarter(now), end: endOfQuarter(now) },
      yearly: { start: startOfYear(now), end: endOfYear(now) }
  };
  const selectedInterval = dateRanges[timeFilter];

  const filteredQuotations = quotations.filter(q => isWithinInterval(new Date(q.date), selectedInterval));
  const filteredLPOs = lpos.filter(l => isWithinInterval(new Date(l.date), selectedInterval));
  const filteredInvoices = invoices.filter(i => isWithinInterval(new Date(i.date), selectedInterval));
  const filteredPayments = payments.filter(p => isWithinInterval(new Date(p.date), selectedInterval));

  const quotationStatusData = (["Approved", "Rejected", "Pending"] as FinancialStatus[]).map(status => ({
    name: status,
    value: filteredQuotations.filter(q => q.status === status).length,
  })).filter(d => d.value > 0);
  
  const lpoStatusData = (["Delivered", "Pending"] as const).map(status => ({
      name: status,
      count: filteredLPOs.filter(l => l.status === status).length,
  }));
  
  const invoiceStatusData = (["Paid", "Unpaid", "Partially Paid"] as const).map(status => ({
      name: status,
      count: filteredInvoices.filter(i => i.status === status).length,
  }));
  
  const paymentsByTime = filteredPayments.reduce((acc, p) => {
      let key: string;
      switch(timeFilter) {
          case 'daily':
          case 'weekly':
              key = format(new Date(p.date), 'EEE'); // Day of week
              break;
          case 'monthly':
              key = format(new Date(p.date), 'dd'); // Day of month
              break;
          case 'quarterly':
          case 'yearly':
              key = format(new Date(p.date), 'MMM'); // Month
              break;
      }
    acc[key] = (acc[key] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = Object.entries(paymentsByTime).map(([name, total]) => ({ name, total }));

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  const showFinanceReports = role === 'Finance Manager' || role === 'Director';

  return (
    <Tabs defaultValue="summary">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Reports</h1>
          <p className="text-muted-foreground">A summary of the current inventory and financial status.</p>
        </div>
        <TabsList>
            <TabsTrigger value="summary"><PieChartIcon className="mr-2" /> Inventory Summary</TabsTrigger>
            <TabsTrigger value="details"><FileText className="mr-2" /> Detailed Stock</TabsTrigger>
            {showFinanceReports && <TabsTrigger value="finance"><Landmark className="mr-2"/> Finance</TabsTrigger>}
        </TabsList>
      </div>

       <TabsContent value="summary">
         <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{totalItems}</div>
                    <p className="text-xs text-muted-foreground">Across all equipment types</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Available</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{totalAvailable}</div>
                    <p className="text-xs text-muted-foreground">{totalItems > 0 ? Math.round((totalAvailable/totalItems) * 100) : 0}% of stock on hand</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most Stocked Item</CardTitle>
                    <PackagePlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{mostStocked?.name || 'N/A'}</div>
                    <p className="text-xs text-muted-foreground">{mostStocked?.total || 0} total units</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lowest Stock Item</CardTitle>
                    <PackageSearch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{leastAvailable?.name || 'N/A'}</div>
                    <p className="text-xs text-muted-foreground">{leastAvailable?.available || 0} units available</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Asset Status by Type</CardTitle>
                   <CardDescription>A breakdown of asset status for each equipment type.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="min-h-[300px] w-full">
                    <RechartsBarChart data={inventoryWithTotals}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="available" fill="var(--color-chart-2)" radius={4} name="Available" />
                      <Bar dataKey="issued" fill="var(--color-chart-1)" radius={4} name="Issued" />
                      <Bar dataKey="faulty" fill="var(--color-chart-5)" radius={4} name="Faulty" />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Asset Distribution by Category</CardTitle>
                  <CardDescription>Shows the proportion of assets in each category.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                   <ChartContainer config={{}} className="min-h-[300px] w-full max-w-sm">
                      <PieChart>
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Pie
                              data={categoryTotals}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              labelLine={false}
                               label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                              {categoryTotals.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                      </PieChart>
                   </ChartContainer>
                </CardContent>
              </Card>
            </div>
         </div>
      </TabsContent>
      <TabsContent value="details">
        <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline">Detailed Stock Report</CardTitle>
                    <CardDescription>A detailed breakdown of all items in the inventory.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => window.print()}>Print Report</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Issued</TableHead>
                        <TableHead>Faulty</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="w-[150px]">Stock Level</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {inventoryWithTotals.map(item => (
                        <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.available}</TableCell>
                        <TableCell>{item.issued}</TableCell>
                        <TableCell>{item.faulty}</TableCell>
                        <TableCell>{item.total}</TableCell>
                        <TableCell>
                            <div className="h-2.5 w-full rounded-full bg-secondary">
                                <div 
                                className="h-2.5 rounded-full bg-primary" 
                                style={{ width: `${item.total > 0 ? (item.available/item.total)*100 : 0}%` }}
                                />
                            </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="finance">
          <div className="flex items-center justify-end space-x-2 mb-4">
              {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as TimeFilter[]).map(filter => (
                  <Button
                      key={filter}
                      variant={timeFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeFilter(filter)}
                      className="capitalize"
                  >
                      {filter}
                  </Button>
              ))}
          </div>
         <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Quotation Status</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                   <ChartContainer config={{}} className="min-h-[250px] w-full max-w-xs">
                      <PieChart>
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Pie data={quotationStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                             {quotationStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                      </PieChart>
                   </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">LPO Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="min-h-[250px] w-full">
                    <RechartsBarChart data={lpoStatusData} layout="vertical" margin={{ left: 10 }}>
                       <CartesianGrid horizontal={false} />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80}/>
                       <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                       <Bar dataKey="count" radius={5}>
                          {lpoStatusData.map((d, i) => <Cell key={d.name} fill={COLORS[i+1 % COLORS.length]} />)}
                       </Bar>
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
             <div className="grid gap-6 md:grid-cols-2">
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Invoice Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="min-h-[250px] w-full">
                    <RechartsBarChart data={invoiceStatusData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" radius={4}>
                         {invoiceStatusData.map((d, i) => <Cell key={d.name} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Payments Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="min-h-[250px] w-full">
                    <RechartsBarChart data={paymentChartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis tickFormatter={(val) => `UGX ${val/1000}k`} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" name="Total Payments" fill="var(--color-chart-2)" radius={4} />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
         </div>
       </TabsContent>
    </Tabs>
  );
}

function NotificationsView({ notifications, onMarkAsRead }: { notifications: AppNotification[], onMarkAsRead: (id: number) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Notifications</CardTitle>
        <CardDescription>Recent alerts and updates.</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Bell className="mx-auto h-12 w-12" />
            <p className="mt-4">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id} className={cn("flex items-start gap-4 p-4 rounded-lg border", n.read ? "bg-secondary/50" : "bg-card")}>
                <div className="flex-1">
                  <p className={cn("text-sm", !n.read && "font-semibold")}>{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.date), "PPP p")}</p>
                </div>
                {!n.read && (
                  <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(n.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


    

    

