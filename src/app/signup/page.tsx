
"use client";

import { SignupForm } from "@/components/signup-form";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <SignupForm />
    </div>
  );
}
