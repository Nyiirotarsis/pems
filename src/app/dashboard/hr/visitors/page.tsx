
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ROLES } from "@/lib/mock-data";
import { visitorRegistrationSchema } from "@/lib/schemas";
import type { UserRole } from "@/types";

// This action would typically be a server action.
// For this prototype, it's a simple function that can be imported.
async function handleRegisterVisitor(values: z.infer<typeof visitorRegistrationSchema>) {
    console.log("Registering visitor:", values);
    // In a real app, this would save to a database and trigger notifications.
    // For now, we just log and return success.
    
    // The actual state update and notification will be handled in pems-dashboard.tsx
    // to simulate the effect without a real backend.
    
    return { success: true, visitor: values };
}


export default function VisitorRegistrationPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof visitorRegistrationSchema>>({
    resolver: zodResolver(visitorRegistrationSchema),
    defaultValues: {
      name: "",
      reason: "",
    },
  });

  async function onSubmit(data: z.infer<typeof visitorRegistrationSchema>) {
     // This is where you would call your server action
    const result = await handleRegisterVisitor(data);

    if (result.success) {
      // In a real SPA-like experience, we might use a global state manager (like Zustand or Context)
      // to update the visitors list. Since we are redirecting, this is simplified.
      // We pass query params to the dashboard to show a toast and simulate the notification.
      const params = new URLSearchParams({
        new_visitor: data.name,
        visited_person: data.personVisiting
      });
      
      router.push(`/dashboard/hr?${params.toString()}`);
      
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Could not register the new visitor.",
      });
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
               <div className="flex items-center gap-4">
                  <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/hr"><ArrowLeft className="h-4 w-4" /></Link>
                  </Button>
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      Register New Visitor
                    </CardTitle>
                    <CardDescription>
                      Fill in the details for the person visiting.
                    </CardDescription>
                  </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visitor's Full Name</FormLabel>
                       <FormControl>
                        <Input placeholder="e.g., Sarah Namatovu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Visit</FormLabel>
                       <FormControl>
                        <Input placeholder="e.g., Interview, Delivery, Meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personVisiting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person/Office Visiting</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a person or office" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
            <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">
                            <UserPlus className="mr-2" />
                            Register Visitor
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will register the visitor and send an alert to the person they are visiting. Continue?
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => form.handleSubmit(onSubmit)()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
