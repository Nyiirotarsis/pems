
"use client";

import * as React from "react";
import {
  Package,
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
  Clapperboard,
  Home,
  PackageSearch,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { initialInventory, ROLES, mockUsers } from "@/lib/mock-data";
import type { UserRole, InventoryItem, AppNotification, Kpi, Visitor } from "@/types";
import { PacificEventsLogo } from "@/components/icons";

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
  mockKpis,
  mockVisitors,
  mockQuotations,
  mockLPOs,
  mockInvoices,
  mockPayments,
} from "@/lib/mock-data";
import { addKpi, completeKpi, addAttendanceRecord } from "@/lib/hr";
import { addVisitor } from "@/lib/hr-visitors";
import { format } from "date-fns";
import DirectorDashboard from "./director-dashboard";
import StoreManagerDashboard from "./store-manager-dashboard";

type View = 
  | "director" | "store" | "finance" | "hr" | "it" | "reports" | "notifications"
  | "inventory" | "assets" | "transactions" | "requests"
  | "field-payments" | "recruitment" | "exit-management" | "leave-management" | "employees" | "visitors"
  | "kpi" | "attendance" | "payroll"
  | "systems" | "security" | "users" | "settings"
  | "album-show";

const navItems: Record<string, { label: string; icon: React.ElementType; isPage?: boolean; href?: string }> = {
  director: { label: "Director Dashboard", icon: Home, isPage: true, href: "/dashboard/director" },
  store: { label: "Store", icon: Warehouse, isPage: true, href: "/dashboard/store" },
  finance: { label: "Finance", icon: Landmark, isPage: true, href: "/dashboard/finance" },
  hr: { label: "HR", icon: Users, isPage: true, href: "/dashboard/hr" },
  it: { label: "IT", icon: Shield, isPage: true, href: "/dashboard/it" },
  reports: { label: "Reports", icon: FileText, isPage: true, href: "/dashboard/reports" },
  notifications: { label: "Notifications", icon: Bell, isPage: true, href: "/dashboard/notifications" },

  // Store Sub-items
  inventory: { label: "Inventory", icon: PackageSearch, isPage: true, href: "/dashboard/store/inventory" },
  assets: { label: "Assets", icon: Wrench, isPage: true, href: "/dashboard/assets" },
  transactions: { label: "Issue / Return", icon: ArrowRightLeft, isPage: true, href: "/dashboard/store/transactions" },
  requests: { label: "Requests", icon: BotMessageSquare, isPage: true, href: "/dashboard/store/requests" },
  maintenance: { label: "Maintenance", icon: Wrench, isPage: true, href: "/dashboard/store/maintenance" },

  // HR Sub-items
  employees: { label: "Employees", icon: Users, isPage: true, href: "/dashboard/hr/employees" },
  payroll: { label: "Payroll", icon: DollarSign, isPage: true, href: "/dashboard/hr/payroll" },
  'field-payments': { label: "Field Payments", icon: DollarSign, isPage: true, href: "/dashboard/hr/field-payments" },
  'leave-management': { label: "Leave", icon: CalendarOff, isPage: true, href: "/dashboard/hr/leave" },
  recruitment: { label: "Recruitment", icon: UserPlus, isPage: true, href: "/dashboard/hr/recruitment" },
  attendance: { label: "Attendance", icon: UserCheck, isPage: true, href: "/dashboard/hr/attendance" },
  visitors: { label: "Visitors", icon: UserCheck, isPage: true, href: "/dashboard/hr/visitors" },
  'exit-management': { label: "Exit", icon: UserMinus, isPage: true, href: "/dashboard/hr/exit" },
  kpi: { label: "KPIs", icon: ClipboardCheck, isPage: true, href: "/dashboard/hr/kpi" },
  
  // IT Sub-items
  systems: { label: "Systems", icon: Cog, isPage: true, href: "/dashboard/it/systems" },
  security: { label: "Security", icon: Shield, isPage: true, href: "/dashboard/it/security" },
  users: { label: "Users", icon: Users, isPage: true, href: "/dashboard/it/users" },
  settings: { label: "Settings", icon: Cog, isPage: true, href: "/dashboard/it/settings" },
  "album-show": { label: "Album Show", icon: Clapperboard, isPage: true, href: "/dashboard/album-show" },
};


export default function PEMSDashboard({ children, initialRole }: { children: React.ReactNode, initialRole: UserRole | null }) {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = React.useState<UserRole | null>(initialRole);
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  
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
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);
  
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };
  
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.forRoles.includes(role) && !n.read).length;
  
  const renderNavForRole = (currentRole: UserRole) => {

    const directorNav = (
      <>
        <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/dashboard/director')} isActive={pathname === '/dashboard/director'}>
                <Home /><span>Dashboard</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
            <Collapsible className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between" isActive={pathname.startsWith('/dashboard/store')}><div className="flex items-center gap-2"><Package /><span>Store</span></div><ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" /></SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                        {['inventory', 'assets', 'transactions', 'requests', 'maintenance'].map(key => {
                            const Icon = navItems[key].icon;
                            return (
                                <SidebarMenuItem key={key}>
                                    <SidebarMenuButton onClick={() => router.push(navItems[key].href!)} isActive={pathname === navItems[key].href}>
                                        <Icon /><span>{navItems[key].label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>

        <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/dashboard/finance')} isActive={pathname.startsWith('/dashboard/finance')}><Landmark /><span>Finance</span></SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
            <Collapsible className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between" isActive={pathname.startsWith('/dashboard/hr')}><div className="flex items-center gap-2"><Users /><span>HR</span></div><ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" /></SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                        {['employees', 'payroll', 'field-payments', 'leave-management', 'recruitment', 'attendance', 'visitors', 'exit-management', 'kpi'].map(key => {
                             const Icon = navItems[key].icon;
                             return (
                                <SidebarMenuItem key={key}>
                                    <SidebarMenuButton onClick={() => router.push(navItems[key].href!)} isActive={pathname === navItems[key].href}>
                                        <Icon /><span>{navItems[key].label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>

        <SidebarMenuItem>
            <Collapsible className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between" isActive={pathname.startsWith('/dashboard/it')}><div className="flex items-center gap-2"><Shield /><span>IT</span></div><ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" /></SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                        {['systems', 'security', 'users', 'settings', 'album-show'].map(key => {
                            const Icon = navItems[key].icon;
                            return (
                                <SidebarMenuItem key={key}>
                                    <SidebarMenuButton onClick={() => router.push(navItems[key].href!)} isActive={pathname === navItems[key].href}>
                                        <Icon /><span>{navItems[key].label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/dashboard/reports')} isActive={pathname === '/dashboard/reports'}>
                <FileText /><span>Reports</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
         <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/dashboard/notifications')} isActive={pathname === '/dashboard/notifications'}>
                <Bell /><span>Notifications</span>
                {unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
            </SidebarMenuButton>
        </SidebarMenuItem>
      </>
    );

    const financeNav = (
        <>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push('/dashboard/finance')} isActive={pathname.startsWith('/dashboard/finance')}><Landmark /><span>Finance Hub</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push(navItems['requests'].href!)} isActive={pathname === navItems['requests'].href}><BotMessageSquare /><span>Requests</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push(navItems['reports'].href!)} isActive={pathname === navItems['reports'].href}><FileText /><span>Reports</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/dashboard/notifications')} isActive={pathname === '/dashboard/notifications'}>
                  <Bell /><span>Notifications</span>
                  {unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
              </SidebarMenuButton>
            </SidebarMenuItem>
        </>
    );
    
    const hrNav = (
      <>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => router.push('/dashboard/hr')} isActive={pathname === '/dashboard/hr'}>
            <Home /><span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {['employees', 'payroll', 'field-payments', 'leave-management', 'recruitment', 'attendance', 'visitors', 'exit-management', 'kpi', 'reports', 'notifications'].map(key => {
            const Icon = navItems[key].icon;
            return (
                <SidebarMenuItem key={key}>
                    <SidebarMenuButton onClick={() => router.push(navItems[key].href!)} isActive={pathname.startsWith(navItems[key].href!)}>
                    <Icon /><span>{navItems[key].label}</span>
                    {key === 'notifications' && unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            );
        })}
      </>
    );

    const itNav = (
      <>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => router.push('/dashboard/it')} isActive={pathname === '/dashboard/it'}>
            <Home /><span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {['inventory', 'assets', 'transactions', 'requests', 'systems', 'security', 'users', 'settings', 'album-show', 'reports', 'notifications'].map(key => {
            const Icon = navItems[key].icon;
            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton onClick={() => router.push(navItems[key].href!)} isActive={pathname.startsWith(navItems[key].href!)}>
                  <Icon /><span>{navItems[key].label}</span>
                  {key === 'notifications' && unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
        })}
      </>
    );
    
    const storeNav = (
         <>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push('/dashboard/store')} isActive={pathname === '/dashboard/store' || pathname === '/dashboard/store/inventory'}><PackageSearch /><span>Inventory</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push('/dashboard/assets')} isActive={pathname.startsWith('/dashboard/assets')}><Wrench /><span>Assets</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push('/dashboard/store/transactions')} isActive={pathname === '/dashboard/store/transactions'}><ArrowRightLeft /><span>Issue / Return</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push('/dashboard/store/requests')} isActive={pathname === '/dashboard/store/requests'}><BotMessageSquare /><span>Requests</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push('/dashboard/store/maintenance')} isActive={pathname === '/dashboard/store/maintenance'}><Wrench /><span>Maintenance</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton onClick={() => router.push('/dashboard/reports')} isActive={pathname === '/dashboard/reports'}><FileText /><span>Reports</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/dashboard/notifications')} isActive={pathname === '/dashboard/notifications'}>
                  <Bell /><span>Notifications</span>
                  {unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
              </SidebarMenuButton>
            </SidebarMenuItem>
         </>
    );

    switch(currentRole) {
        case 'CEO':
        case 'Director':
            return directorNav;
        case 'Finance Manager':
            return financeNav;
        case 'HR/Admin':
            return hrNav;
        case 'IT Managers':
            return itNav;
        case 'Store Manager':
            return storeNav;
        default:
            return null;
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
            {renderNavForRole(role)}
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
          <header className="flex items-center justify-between mb-6 md:hidden">
             <SidebarTrigger />
          </header>
          <main>
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
