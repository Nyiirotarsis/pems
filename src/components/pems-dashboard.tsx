

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
  UserPlus,
  Briefcase,
  CalendarOff,
  UserMinus,
  FileBarChart,
  DollarSign,
  Shield,
  Cog,
} from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { initialInventory, ROLES, mockUsers } from "@/lib/mock-data";
import type { UserRole, InventoryItem, AppNotification, Kpi, Visitor } from "@/types";
import { PacificEventsLogo } from "@/components/icons";

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
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { updateInventory } from "@/lib/inventory";
import { InventoryView } from "@/components/dashboard/inventory-view";
import { TransactionsView } from "@/components/dashboard/transactions-view";
import { RequestsView } from "@/components/dashboard/requests-view";
import { ReportsView } from "@/components/dashboard/reports-view";
import { NotificationsView } from "@/components/dashboard/notifications-view";
import { KpiTrackerView } from "@/components/dashboard/kpi-tracker-view";
import { AttendanceView } from "@/components/dashboard/attendance-view";
import { FinanceModule } from "@/components/finance-module";
import HrDashboard from "@/components/hr-dashboard";
import ITDashboard from "@/components/it-dashboard";
import {
  mockAttendance,
  mockFieldPaymentRequests,
  mockInvoices,
  mockKpis,
  mockLPOs,
  mockPayments,
  mockQuotations,
  mockVisitors,
} from "@/lib/mock-data";
import { addKpi, completeKpi, addAttendanceRecord, addFieldPaymentRequest, updateFieldPaymentStatus } from "@/lib/hr";
import { addVisitor } from "@/lib/hr-visitors";
import { format } from "date-fns";

type View = "dashboard" | "inventory" | "assets" | "transactions" | "requests" | "reports" | "notifications" | "finance" | "kpi" | "attendance" | "systems" | "security" | "users" | "settings";

const permissions: Record<UserRole, View[]> = {
  "Store Manager": ["inventory", "assets", "transactions", "requests", "reports", "notifications", "kpi", "attendance"],
  "Finance Manager": ["finance", "requests", "reports", "notifications", "kpi", "attendance"],
  "HR/Admin": ["dashboard", "kpi", "attendance", "reports", "notifications"],
  "CEO": ["inventory", "assets", "transactions", "requests", "reports", "notifications", "finance", "kpi", "attendance"],
  "Director": ["inventory", "assets", "transactions", "requests", "reports", "notifications", "finance", "kpi", "attendance"],
  "IT Managers": ["dashboard", "inventory", "assets", "transactions", "notifications", "requests", "kpi", "reports", "systems", "security", "users", "settings"],
};

const navItems: Record<
  string,
  { label: string; icon: React.ElementType; forRoles: UserRole[]; isPage?: boolean; href?: string }
> = {
  dashboard: {
    label: "Dashboard",
    icon: BarChart,
    forRoles: ["HR/Admin", "IT Managers"],
  },
  inventory: {
    label: "Inventory",
    icon: PackageSearch,
    forRoles: ["Store Manager", "CEO", "IT Managers", "Director"],
  },
  assets: {
      label: "Assets",
      icon: Wrench,
      forRoles: ["Store Manager", "CEO", "IT Managers", "Director"],
      isPage: true,
      href: "/dashboard/assets"
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
    forRoles: ["Store Manager", "Finance Manager", "HR/Admin", "CEO", "Director", "IT Managers"],
  },
  notifications: {
      label: "Notifications",
      icon: Bell,
      forRoles: ["Store Manager", "CEO", "Director", "Finance Manager", "HR/Admin", "IT Managers"],
  },
  systems: { label: "Systems", icon: Cog, forRoles: ["IT Managers"], isPage: true, href: "/dashboard/it/systems" },
  security: { label: "Security", icon: Shield, forRoles: ["IT Managers"], isPage: true, href: "/dashboard/it/security" },
  users: { label: "Users", icon: Users, forRoles: ["IT Managers"], isPage: true, href: "/dashboard/it/users" },
  settings: { label: "Settings", icon: Cog, forRoles: ["IT Managers"], isPage: true, href: "/dashboard/it/settings" },
};



export default function PEMSDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = React.useState<UserRole | null>(null);
  const [activeView, setActiveView] = React.useState<View>("inventory");
  const [inventory, setInventory] = React.useState(initialInventory);
  const [kpis, setKpis] = React.useState(mockKpis);
  const [attendance, setAttendance] = React.useState(mockAttendance);
  const [fieldPayments, setFieldPayments] = React.useState(mockFieldPaymentRequests);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [visitors, setVisitors] = React.useState<Visitor[]>(mockVisitors);
  
  const addNotification = React.useCallback((message: string, forRoles: UserRole[]) => {
    const newNotification: AppNotification = {
      id: Date.now(),
      message,
      date: new Date().toISOString(),
      read: false,
      forRoles,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (!storedRole || !ROLES.includes(storedRole)) {
      router.push("/login");
    } else {
      setRole(storedRole);
      // Set initial view based on role
      if (permissions[storedRole].length > 0) {
        const initialView = permissions[storedRole][0];
        setActiveView(initialView);
      }
    }
  }, [router]);
  
  React.useEffect(() => {
    const newVisitorName = searchParams.get('new_visitor');
    const visitedPersonRole = searchParams.get('visited_person') as UserRole;
    
    if (newVisitorName && visitedPersonRole) {
      const newVisitor = {
        name: newVisitorName,
        personVisiting: visitedPersonRole,
        reason: searchParams.get('reason') || 'Unknown',
      };
      
      const { newVisitor: addedVisitor, error } = addVisitor(visitors, newVisitor);
      
      if (addedVisitor) {
        setVisitors(prev => [addedVisitor, ...prev]);
        addNotification(`Visitor Alert: ${addedVisitor.name} has arrived to see you.`, [addedVisitor.personVisiting]);
        toast({
          title: "Visitor Registered",
          description: `${addedVisitor.name} has been checked in. An alert has been sent to ${addedVisitor.personVisiting}.`,
        });
        // Clean up URL
        router.replace('/dashboard');
      }
    }
  }, [searchParams, router, visitors, addNotification, toast]);

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
  
  const handleViewChange = (view: View, isPage?: boolean, href?: string) => {
    if (role && permissions[role].includes(view)) {
        if (isPage && href) {
            router.push(href);
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

  const handleUpdateInventory = (
    equipmentId: number,
    quantity: number,
    type: "issue" | "return" | "restock",
    condition?: "Good" | "Damaged" | "Lost" | "Faulty",
    userRole?: UserRole
  ) => {
    const { updatedInventory, affectedAssets } = updateInventory(inventory, equipmentId, quantity, type, condition, role || 'Unknown');
    setInventory(updatedInventory);
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

  const hrNav = (
    <>
       <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleViewChange("dashboard")} isActive={activeView === 'dashboard'}>
            <BarChart /><span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <Users />
              <span>Employees</span>
            </div>
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubButton onClick={() => router.push('/dashboard/hr/employees')}>Employee List</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => router.push('/dashboard/hr/recruitment')}>Recruitment</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => router.push('/dashboard/hr/exit')}>Exit Management</SidebarMenuSubButton>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
       <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <DollarSign />
              <span>Payroll</span>
            </div>
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubButton onClick={() => router.push('/dashboard/hr/payroll')}>Run Payroll</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => router.push('/dashboard/hr/field-payments')}>Field Payments</SidebarMenuSubButton>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
        <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span>Time & People</span>
            </div>
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
             <SidebarMenuSubButton onClick={() => handleViewChange("attendance")} isActive={activeView === "attendance"}>Attendance</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => router.push('/dashboard/hr/leave')}>Leave Management</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => router.push('/dashboard/hr/visitors')}>Visitors</SidebarMenuSubButton>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
       <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleViewChange("kpi")} isActive={activeView === 'kpi'}>
            <ClipboardCheck /><span>KPI Tracker</span>
          </SidebarMenuButton>
      </SidebarMenuItem>
       <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleViewChange("reports")} isActive={activeView === 'reports'}>
            <FileBarChart /><span>Reports</span>
          </SidebarMenuButton>
      </SidebarMenuItem>
       <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleViewChange("notifications")} isActive={activeView === 'notifications'}>
            <Bell /><span>Notifications</span>
             {unreadCount > 0 && (
                  <Badge className="ml-auto">{unreadCount}</Badge>
                )}
          </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );

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
            <SidebarMenuSubButton onClick={() => handleViewChange("assets", true, "/dashboard/assets")} isActive={activeView === "assets"}>Assets</SidebarMenuSubButton>
            <SidebarMenuSubButton onClick={() => handleViewChange("transactions")} isActive={activeView === "transactions"}>Issue / Return</SidebarMenuSubButton>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      
       <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <Users />
              <span>Human Resources</span>
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

      {[ 'finance', 'reports', 'notifications'].map(key => {
        const viewKey = key as View;
        const item = navItems[viewKey];
        if (item.forRoles.includes(role)) {
          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                onClick={() => handleViewChange(viewKey, item.isPage, item.href)}
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
                onClick={() => handleViewChange(viewKey, item.isPage, item.href)}
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
  
  const renderNav = () => {
    switch(role) {
      case 'Director': return directorNav;
      case 'HR/Admin': return hrNav;
      default: return defaultNav;
    }
  }

  const renderContent = () => {
    if (role === 'HR/Admin' && activeView === 'dashboard') {
      return <HrDashboard visitors={visitors}/>;
    }
    
    if (role === 'IT Managers' && activeView === 'dashboard') {
        return <ITDashboard />;
    }

    switch(activeView) {
      case 'inventory':
        return (
          <InventoryView
            inventory={filteredInventory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRestock={(values) => {
              const equipmentId = parseInt(values.equipmentId);
              handleUpdateInventory(equipmentId, values.quantity, "restock");
              toast({
                title: "Success",
                description: `${values.quantity} units of ${
                  inventory.find((i) => i.id === equipmentId)?.name
                } restocked by ${values.receivedBy}.`,
              });
            }}
          />
        );
      case 'transactions':
         return (
              <TransactionsView 
                inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} 
                onIssue={(values) => {
                  const equipmentId = parseInt(values.equipmentId);
                  handleUpdateInventory(equipmentId, values.quantity, "issue");
                  toast({
                    title: "Success",
                    description: `${values.quantity} units of ${inventory.find(i => i.id === equipmentId)?.name} issued.`,
                  });
                }}
                onReturn={(values) => {
                  const equipmentId = parseInt(values.equipmentId);
                  handleUpdateInventory(equipmentId, values.quantity, "return", values.condition);
                   toast({
                    title: "Success",
                    description: `${values.quantity} units of ${inventory.find(i => i.id === equipmentId)?.name} returned in ${values.condition} condition.`,
                  });
                }}
              />
            );
      case 'requests':
        return (
          <RequestsView 
            role={role} 
            inventory={inventory.map(item => ({...item, ...getInventoryTotals(item)}))} 
            onNotify={addNotification} 
          />
        );
      case 'kpi':
        return <KpiTrackerView 
            kpis={kpis} 
            onAddKpi={(v) => {
                const {newKpi, error} = addKpi(kpis, v);
                if(error) {
                    toast({ variant: "destructive", title: "Error", description: error });
                } else if(newKpi) {
                    setKpis(prev => [newKpi, ...prev]);
                    toast({ title: "KPI Added", description: `A new KPI "${v.activityName}" has been added.` });
                }
            }}
            onCompleteKpi={(id) => {
                const { updatedKpis, error } = completeKpi(kpis, id);
                if (error) {
                  toast({ variant: "destructive", title: "Error", description: error });
                } else {
                  setKpis(updatedKpis);
                  toast({ title: "KPI Completed", description: `The KPI has been marked as completed.` });
                }
            }}
        />;
      case 'attendance':
        return <AttendanceView
            attendance={attendance}
            onAddRecord={(v) => {
                const {newRecord, error} = addAttendanceRecord(attendance, v);
                if (error) {
                    toast({ variant: "destructive", title: "Error", description: error });
                } else if(newRecord) {
                    setAttendance(prev => [newRecord, ...prev]);
                    toast({ title: "Attendance Recorded", description: `Attendance for ${mockUsers.find(u => u.id.toString() === v.userId)?.username} on ${format(v.date, "PPP")} has been logged as ${v.status}.` });
                }
            }}
            role={role}
            fieldPayments={fieldPayments}
            onAddFieldPayment={(v) => {
                const { newRequest, error } = addFieldPaymentRequest(fieldPayments, v);
                if (error) {
                    toast({ variant: "destructive", title: "Error", description: error });
                } else if (newRequest) {
                    setFieldPayments(prev => [newRequest, ...prev]);
                    addNotification(`New payment request for ${newRequest.staffName} (UGX ${newRequest.totalAmount.toLocaleString()}) needs approval.`, ['Finance Manager']);
                    toast({ title: "Payment Request Submitted", description: `Requisition for ${newRequest.staffName} has been sent to Finance.` });
                }
            }}
            onUpdateFieldPaymentStatus={(id, status) => {
                const { updatedPayments, updatedPayment, error } = updateFieldPaymentStatus(fieldPayments, id, status);
                 if (error) {
                    toast({ variant: "destructive", title: "Error", description: error });
                } else if (updatedPayment) {
                    setFieldPayments(updatedPayments);
                    if (status === 'Paid') {
                      addNotification(`Payment for ${updatedPayment.staffName} has been processed. Please acknowledge and upload receipt.`, ['CEO']);
                    }
                    if (status === 'Acknowledged') {
                         addNotification(`CEO has acknowledged payment for ${updatedPayment.staffName}.`, ['Finance Manager']);
                    }
                }
            }}
        />;
      case 'finance':
        return <FinanceModule role={role} />;
      case 'reports':
        return <ReportsView inventory={inventory} role={role} quotations={mockQuotations} lpos={mockLPOs} invoices={mockInvoices} payments={mockPayments} />;
      case 'notifications':
        return <NotificationsView notifications={notifications.filter(n => n.forRoles.includes(role!))} onMarkAsRead={markNotificationAsRead} />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {role}!</CardTitle>
              <CardDescription>Select a module from the sidebar to get started.</CardDescription>
            </CardHeader>
          </Card>
        )
    }
  }


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
            {renderNav()}
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
            {renderContent()}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

