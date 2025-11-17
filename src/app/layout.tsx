
"use client";

import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";
import { PacificEventsLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageProvider, useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

// export const metadata: Metadata = {
//   title: 'Pacific Events',
//   description: 'Manage your events with ease.',
// };

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showAvatar = pathname.startsWith('/dashboard');
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <html lang={language}>
      <head>
        <title>Pacific Events</title>
        <meta name="description" content="Manage your events with ease." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <header className="bg-card border-b shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center justify-center gap-2">
              <PacificEventsLogo className="h-10 w-auto" />
            </Link>
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
              <Link href="/help" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                {t.navHelp}
              </Link>
              <Link href="/contact" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                {t.navContact}
              </Link>
            </nav>
            <div className="flex items-center gap-4">
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
                    <DropdownMenuItem disabled>Swahili</DropdownMenuItem>
                    <DropdownMenuItem disabled>Arabic</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                   <DropdownMenuLabel>Local Languages</DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuGroup>
                    <DropdownMenuItem disabled>Luganda</DropdownMenuItem>
                    <DropdownMenuItem disabled>Runyankore</DropdownMenuItem>
                    <DropdownMenuItem disabled>Lusoga</DropdownMenuItem>
                    <DropdownMenuItem disabled>Acholi</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {showAvatar && (
                 <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              )}
               {!showAvatar && (
                  <Button asChild size="sm">
                    <Link href="/login">{t.loginButton}</Link>
                  </Button>
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

        <Toaster />
      </body>
    </html>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  );
}
