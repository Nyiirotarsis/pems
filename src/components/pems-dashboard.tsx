

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
} from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FinanceModule } from "@/components/finance-module";

import { cn } from "@/lib/utils";
import { initialInventory, ROLES, CONDITIONS, mockKpis, mockUsers, assetCategories } from "@/lib/mock-data";
import type { UserRole, InventoryItem, Condition, AppNotification, Asset, Kpi } from "@/types";
import { PEMSIcon } from "@/components/icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type View = "inventory" | "assets" | "transactions" | "requests" | "reports" | "notifications" | "finance" | "kpi";

const permissions: Record<UserRole, View[]> = {
  "Store Manager": ["inventory", "assets", "transactions", "requests", "reports", "notifications", "kpi"],
  "Finance Manager": ["finance", "requests", "reports", "notifications", "kpi"],
  "HR/Admin": ["reports", "notifications", "kpi"],
  "CEO": ["inventory", "assets", "requests", "reports", "notifications", "finance", "kpi"],
  "Director": ["inventory", "assets", "requests", "reports", "notifications", "finance", "kpi"],
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
    forRoles: ["Store Manager", "IT Managers"],
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
});

export default function PEMSDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [activeView, setActiveView] = React.useState<View>("inventory");
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialInventory);
  const [kpis, setKpis] = React.useState<Kpi[]>(mockKpis);
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
      };
      setKpis(prev => [newKpi, ...prev]);
      toast({
        title: "KPI Added",
        description: `A new KPI "${values.activityName}" has been added.`,
      })
  }

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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <PEMSIcon className="size-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="font-headline text-xl font-semibold">PEMS</h2>
              <p className="text-xs text-muted-foreground">Inventory Manager</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
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
            {activeView === "kpi" && <KpiTrackerView kpis={kpis} onAddKpi={addKpi} />}
            {activeView === "finance" && <FinanceModule />}
            {activeView === "reports" && <ReportsView inventory={inventory} />}
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
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof restockFormSchema>>({
    resolver: zodResolver(restockFormSchema),
    defaultValues: { quantity: 1, receivedBy: "" },
  });

  function onSubmit(values: z.infer<typeof restockFormSchema>) {
    onRestock(values);
    form.reset();
    setOpen(false);
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
            <Dialog open={open} onOpenChange={setOpen}>
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
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Log Restock</Button>
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
                <Button type="submit">Issue Item</Button>
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
                <Button type="submit">Receive Item</Button>
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
          setOutOfStockMessage(`The number of available equipment is ${availableCount} which is less than requested. Please contact the Finance Manager for outsourcing.`);
      } else {
        startTransition(async () => {
          const response = await handleSuggestOutsourcing({ item: values.item, quantity: values.quantity });
          if (response.suggestions && response.suggestions.length > 0) {
            setAiResponse(response);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not fetch outsourcing suggestions. Please try again.",
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
              Check Availability
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

function KpiTrackerView({ kpis, onAddKpi }: { kpis: Kpi[], onAddKpi: (values: z.infer<typeof kpiFormSchema>) => void }) {
    const [open, setOpen] = React.useState(false);
    const form = useForm<z.infer<typeof kpiFormSchema>>({
        resolver: zodResolver(kpiFormSchema),
        defaultValues: {
            category: "",
            activityName: "",
            description: "",
        },
    });

    const getUserDetails = (userId: number) => {
        const user = mockUsers.find(u => u.id === userId);
        return user ? { name: user.username, role: user.role } : { name: 'Unknown', role: 'Unknown' };
    }

    function onSubmit(values: z.infer<typeof kpiFormSchema>) {
        onAddKpi(values);
        form.reset();
        setOpen(false);
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="font-headline">KPI Tracker</CardTitle>
                        <CardDescription>Define and monitor Key Performance Indicators for staff.</CardDescription>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add KPI
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
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
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>KPI Description</FormLabel>
                                                <FormControl><Textarea placeholder="Describe the KPI..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                        <Button type="submit">Save KPI</Button>
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
                            <TableHead>Category</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>KPI Description</TableHead>
                            <TableHead>Frequency</TableHead>
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
                                    <TableCell>{kpi.category}</TableCell>
                                    <TableCell>{kpi.activityName}</TableCell>
                                    <TableCell className="max-w-xs">{kpi.description}</TableCell>
                                    <TableCell><Badge variant="secondary">{kpi.frequency}</Badge></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


function ReportsView({ inventory }: { inventory: InventoryItem[] }) {
  
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <Tabs defaultValue="summary">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Reports</h1>
          <p className="text-muted-foreground">A summary of the current inventory status.</p>
        </div>
        <TabsList>
            <TabsTrigger value="summary"><PieChartIcon className="mr-2" /> Summary</TabsTrigger>
            <TabsTrigger value="details"><FileText className="mr-2" /> Detailed</TabsTrigger>
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
