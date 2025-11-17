
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PacificEventsLogo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background">
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
