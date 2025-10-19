import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PacificEventsLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'Pacific Events',
  description: 'Manage your events with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <header className="bg-card border-b shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <PacificEventsLogo className="h-10 w-auto" />
                </div>
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-card border-t mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Pacific Events Management System. All Rights Reserved.
            </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
