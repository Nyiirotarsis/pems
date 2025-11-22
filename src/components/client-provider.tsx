"use client";

import { LanguageProvider } from "@/context/language-context";
import { AppContent } from "@/components/app-content";
import { Toaster } from "@/components/ui/toaster";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppContent>{children}</AppContent>
      <Toaster />
    </LanguageProvider>
  );
}
