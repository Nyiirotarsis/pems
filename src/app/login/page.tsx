
"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}
