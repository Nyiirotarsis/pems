
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col flex-1 bg-background">
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline text-primary">
          {t.homeTitle}
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
          {t.homeSubtitle}
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/login">{t.getStartedButton}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
