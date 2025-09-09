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
  Landmark
} from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FinanceModule } from "@/components/finance-module";

import { cn } from "@/lib/utils";
import { initialInventory, ROLES, CONDITIONS } from "@/lib/mock-data";
import type { UserRole, InventoryItem, Condition, AppNotification } from "@/types";
import { PEMSIcon } from "@/components/icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

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

type View = "inventory" | "transactions" | "requests" | "reports" | "notifications" | "finance";

const permissions: Record<UserRole, View[]> = {
  "Store Manager": ["inventory", "transactions", "requests", "reports", "notifications"],
  "Finance Manager": ["finance", "requests", "reports", "notifications"],
  "HR/Admin": ["reports", "notifications"],
  "CEO": ["inventory", "requests", "reports", "notifications"],
  "Director": ["reports", "notifications"],
  "IT": ["inventory", "transactions", "notifications"],
};

const navItems: Record<
  View,
  { label: string; icon: React.ElementType; forRoles: UserRole[] }
> = {
  inventory: {
    label: "Inventory",
    icon: PackageSearch,
    forRoles: ["Store Manager", "CEO", "IT"],
  },
  transactions: {
    label: "Issue / Return",
    icon: ArrowRightLeft,
    forRoles: ["Store Manager", "IT"],
  },
  requests: {
    label: "Requests",
    icon: BotMessageSquare,
    forRoles: ["Store Manager", "Finance Manager", "CEO"],
  },
  finance: {
    label: "Finance",
    icon: Landmark,
    forRoles: ["Finance Manager"],
  },
  reports: {
    label: "Reports",
    icon: FileText,
    forRoles: ["Store Manager", "Finance Manager", "HR/Admin", "CEO", "Director"],
  },
  notifications: {
      label: "Notifications",
      icon: Bell,
      forRoles: ["Store Manager", "CEO", "Director", "Finance Manager", "HR/Admin", "IT"],
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


export default function PEMSDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [activeView, setActiveView] = React.useState<View>("inventory");
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialInventory);
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
  
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewChange = (view: View) => {
    if (role && permissions[role].includes(view)) {
      setActiveView(view);
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
          let newAvailable = item.available;
          let newTotal = item.total;
          if (type === "issue") {
            newAvailable -= quantity;
          } else if (type === "return") {
            if (condition === "Good") {
              newAvailable += quantity;
            }
            // If damaged or lost, available count doesn't increase but total might be adjusted later
          } else if (type === "restock") {
            newAvailable += quantity;
            newTotal += quantity;
          }
          return {
            ...item,
            available: newAvailable,
            total: newTotal,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      })
    );
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
                inventory={inventory} 
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
            {activeView === "requests" && <RequestsView inventory={inventory} onNotify={addNotification} />}
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

function InventoryView({ inventory, searchQuery, setSearchQuery, onRestock }: { inventory: InventoryItem[], searchQuery: string, setSearchQuery: (q: string) => void, onRestock: (values: z.infer<typeof restockFormSchema>) => void }) {
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
                  <DialogDescription>Log the receipt of new stock.</DialogDescription>
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
                  <TableCell className="text-center">{item.total}</TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
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

function TransactionsView({ inventory, onIssue, onReturn }: { inventory: InventoryItem[], onIssue: (v: any) => void, onReturn: (v: any) => void }) {
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

function TransactionFormFields({ form, inventory, type }: { form: any, inventory: InventoryItem[], type: 'issue' | 'return' }) {
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

function RequestsView({ inventory, onNotify }: { inventory: InventoryItem[], onNotify: (message: string, roles: UserRole[]) => void }) {
  const [isPending, startTransition] = useTransition();
  const [aiResponse, setAiResponse] = React.useState<SuggestOutsourcingOptionsOutput | null>(null);
  const [inStock, setInStock] = React.useState<boolean | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: { item: "", quantity: 1 },
  });

  function onSubmit(values: z.infer<typeof requestFormSchema>) {
    setAiResponse(null);
    setInStock(null);
    
    const notificationRoles: UserRole[] = ["CEO", "Director", "Finance Manager", "HR/Admin", "IT"];
    onNotify(`A request was made for ${values.quantity} of "${values.item}".`, notificationRoles);

    const requestedItem = inventory.find(
      (item) => item.name.toLowerCase() === values.item.toLowerCase()
    );

    if (requestedItem && requestedItem.available >= values.quantity) {
      setInStock(true);
    } else {
      setInStock(false);
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

function ReportsView({ inventory }: { inventory: InventoryItem[] }) {
  const totalItems = inventory.reduce((sum, item) => sum + item.total, 0);
  const totalAvailable = inventory.reduce((sum, item) => sum + item.available, 0);
  const mostStocked = inventory.reduce((max, item) => item.total > max.total ? item : max, inventory[0]);
  const leastAvailable = inventory.reduce((min, item) => item.available < min.available ? item : min, inventory[0]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Inventory Report</CardTitle>
            <CardDescription>A summary of the current inventory status.</CardDescription>
          </div>
          <Button variant="outline" onClick={() => window.print()}>Print Report</Button>
        </div>
      </CardHeader>
      <CardContent>
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
        <div className="mt-6">
          <h3 className="font-headline text-lg mb-2">Detailed Stock Levels</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[100px]">Stock Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.available}</TableCell>
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
        </div>
      </CardContent>
    </Card>
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
