"use client";

import { LanguageProvider } from "@/context/language-context";
import { AppContent } from "@/components/app-content";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <AppContent>{children}</AppContent>
    </LanguageProvider>
  );
}
