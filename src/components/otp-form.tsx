
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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

const otpFormSchema = z.object({
  code: z.string().min(6, "Please enter the 6-digit code.").max(6),
});

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof otpFormSchema>) {
    startTransition(() => {
      // In a real application, you would verify the OTP here.
      console.log(values);
      
      toast({
        title: "Account Verified",
        description: "Your account has been successfully created. Please log in.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <PacificEventsLogo className="mx-auto h-20 w-auto" />
        <CardTitle className="font-headline mt-4">Verify Your Account</CardTitle>
        <CardDescription>
            Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email || 'your email'}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify and Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
       <CardFooter className="flex justify-center text-sm">
        <p>
          Didn't receive a code?{' '}
          <Link href="#" className="font-semibold text-primary hover:underline">
            Resend
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
