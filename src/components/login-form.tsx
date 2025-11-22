
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PacificEventsLogo } from "@/components/icons";
import { UserRole } from "@/types";

const loginFormSchema = z.object({
  username: z.string().min(1, "Please enter your username."),
  password: z.string().min(1, "Please enter your password."),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "it",
      password: "123",
    },
  });

  const getDashboardUrlForRole = (role: UserRole) => {
    switch (role) {
      case "CEO":
      case "Director":
        return "/dashboard/director";
      case "Finance Manager":
        return "/dashboard/finance";
      case "HR/Admin":
        return "/dashboard/hr";
      case "IT Managers":
        return "/dashboard/it";
      case "Store Manager":
        return "/dashboard/store";
      case "Field Operational Officer":
        return "/dashboard/field-ops";
      case "Media & Communications Officer":
        return "/dashboard/media";
      default:
        return "/dashboard";
    }
  }

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (result.success && result.user) {
          localStorage.setItem("userRole", result.user.role);

          toast({
            title: "Login Successful",
            description: `Welcome back, ${result.user?.role}!`,
          });

          const dashboardUrl = getDashboardUrlForRole(result.user.role);
          router.replace(dashboardUrl);
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: result.error || "Invalid username or password.",
          });
        }
      } catch (error) {
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: "An unexpected error occurred. Please try again.",
          });
      }
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <PacificEventsLogo className="mx-auto h-20 w-auto" />
        <CardTitle className="font-headline mt-4">Login</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., storemanager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              data-pending={isPending}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin hidden data-[pending=true]:inline-block" />
              <span className="data-[pending=true]:hidden">Sign In</span>
            </Button>
          </form>
        </Form>
      </CardContent>
       <CardFooter className="flex justify-center text-sm">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
