
"use client";

import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";
import { PacificEventsLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

// export const metadata: Metadata = {
//   title: 'Pacific Events',
//   description: 'Manage your events with ease.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showAuthButtons = !pathname.startsWith('/dashboard') && pathname !== '/login' && pathname !== '/signup';
  const showAvatar = pathname.startsWith('/dashboard');

  return (
    <html lang="en">
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
                Home
              </Link>
              <Link href="/users" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                Users
              </Link>
              <Link href="/roles" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                Roles
              </Link>
              <Link href="/help" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                Help
              </Link>
              <Link href="/contact" className="text-sm font-medium text-blue-600 hover:underline underline-offset-4">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              {showAuthButtons && (
                <Button asChild size="sm">
                  <Link href="/login">Get Started</Link>
                </Button>
              )}
              {showAvatar && (
                 <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
        
        <footer className="bg-black text-white mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm">
                &copy; {new Date().getFullYear()} Pacific Events Management System. All Rights Reserved.
            </div>
        </footer>

        <Toaster />
      </body>
    </html>
  );
}
