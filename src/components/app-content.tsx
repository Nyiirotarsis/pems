"use client";

import Link from 'next/link';
import * as React from 'react';
import { PacificEventsLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/context/language-context';
import { UserRole } from '@/types';
import { useIsClient } from '@/hooks/use-is-client';

function LanguageDropdown() {
    const { setLanguage } = useLanguage();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                Language
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>International</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLanguage('fr')}>French</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLanguage('sw')}>Swahili</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLanguage('ar')}>Arabic</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Local Languages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setLanguage('lg')}>Luganda</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLanguage('ny')}>Runyankore</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLanguage('soga')}>Lusoga</DropdownMenuItem>
            </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function UserDropdown({ onLogout }: { onLogout: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
            >
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export function AppContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const isClient = useIsClient();
  const [dashboardHome, setDashboardHome] = React.useState('/dashboard');

  const showDashboardHeader = pathname.startsWith('/dashboard');

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };
  
  React.useEffect(() => {
    if (isClient) {
        const getDashboardHome = () => {
            const role = localStorage.getItem("userRole") as UserRole;
            if (role) {
                switch (role) {
                    case "CEO":
                    case "Director":
                      return "/dashboard/director";
                    case "Finance Manager":
                      return "/dashboard/finance";
                    case "HR/Admin":
                      return "/dashboard/hr";
                    case "IT Managers":
                      return "/dashboard/it";
                    case "Store Manager":
                      return "/dashboard/store";
                    case "Field Operational Officer":
                        return "/dashboard/field-ops";
                    case "Media & Communications Officer":
                        return "/dashboard/media";
                    default:
                      return "/dashboard";
                }
            }
          return "/dashboard";
        }
        setDashboardHome(getDashboardHome());
    }
  }, [pathname, isClient]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href={showDashboardHeader ? dashboardHome : "/"} className="flex items-center justify-center gap-2">
            <PacificEventsLogo className="h-10 w-auto" />
            </Link>
            
            {!showDashboardHeader && (
                <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
                    <Link href="/" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                        {t.navHome}
                    </Link>
                    <Link href="/users" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                        {t.navUsers}
                    </Link>
                    <Link href="/roles" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                        {t.navRoles}
                    </Link>
                    <Link href="/policies" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                        {t.navPolicies}
                    </Link>
                    <Link href="/help" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                        {t.navHelp}
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                        {t.navContact}
                    </Link>
                </nav>
            )}
            
            <div className="flex items-center gap-4">
            {!showDashboardHeader && (
                <LanguageDropdown />
            )}

            {isClient && (
              showDashboardHeader ? (
                  <UserDropdown onLogout={handleLogout} />
              ) : (
                  <Button asChild size="sm">
                      <Link href="/login">{t.loginButton}</Link>
                  </Button>
              )
            )}
            </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-black text-white mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm">
              &copy; {new Date().getFullYear()} {t.footerText}
          </div>
      </footer>
    </div>
  );
}