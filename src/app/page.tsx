
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PacificEventsLogo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b">
        <Link href="#" className="flex items-center justify-center">
          <PacificEventsLogo className="h-10 w-auto" />
          <span className="sr-only">Pacific Events</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Users
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Roles
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Help
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
          Pacific Events Management System
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
          Streamline your event operations from inventory to finance, all in one powerful platform.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
