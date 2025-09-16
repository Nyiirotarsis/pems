"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Package, PackageSearch, BotMessageSquare } from "lucide-react";
import { requestFormSchema } from "@/lib/schemas";
import { UserRole, InventoryItem } from "@/types";
import { handleSuggestOutsourcing } from "@/app/actions";
import type { SuggestOutsourcingOptionsOutput } from "@/ai/flows/suggest-outsourcing-options";

import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RequestsViewProps = {
  inventory: (InventoryItem & { available: number; total: number })[];
  onNotify: (message: string, roles: UserRole[]) => void;
  role: UserRole | null;
};

export function RequestsView({
  inventory,
  onNotify,
  role,
}: RequestsViewProps) {
  const [isPending, startTransition] = useTransition();
  const [aiResponse, setAiResponse] =
    React.useState<SuggestOutsourcingOptionsOutput | null>(null);
  const [inStock, setInStock] = React.useState<boolean | null>(null);
  const [outOfStockMessage, setOutOfStockMessage] = React.useState<
    string | null
  >(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: { item: "", quantity: 1 },
  });

  function onSubmit(values: z.infer<typeof requestFormSchema>) {
    setAiResponse(null);
    setInStock(null);
    setOutOfStockMessage(null);

    const notificationRoles: UserRole[] = [
      "CEO",
      "Director",
      "Finance Manager",
      "HR/Admin",
      "IT Managers",
    ];
    onNotify(
      `A request was made for ${values.quantity} of "${values.item}".`,
      notificationRoles
    );

    const requestedItem = inventory.find(
      (item) => item.name.toLowerCase() === values.item.toLowerCase()
    );

    if (requestedItem && requestedItem.available >= values.quantity) {
      setInStock(true);
    } else {
      setInStock(false);
      const availableCount = requestedItem?.available || 0;
      if (role === "Store Manager" || role === "IT Managers") {
        setOutOfStockMessage(
          `The number of available equipment is ${availableCount}, which is less than requested. Please contact the Finance Manager for outsourcing.`
        );
      } else {
        startTransition(async () => {
          try {
            const response = await handleSuggestOutsourcing({
              item: values.item,
              quantity: values.quantity,
            });
            if (response.suggestions && response.suggestions.length > 0) {
              setAiResponse(response);
            } else {
              setOutOfStockMessage(
                "This item is unavailable, and we could not fetch outsourcing suggestions at this time. Please contact the Finance Manager directly."
              );
            }
          } catch (e) {
            toast({
              variant: "destructive",
              title: "Error",
              description:
                "An unexpected error occurred while fetching suggestions.",
            });
          }
        });
      }
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Request Item</CardTitle>
        <CardDescription>
          Check item availability. If unavailable, get AI-powered outsourcing
          options.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="item"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Projector" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <span>Check Availability</span>
            </Button>
            {isPending && (
              <div className="text-sm text-muted-foreground flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking stock and searching for outsourcing options...
              </div>
            )}
            {inStock === true && (
              <Card className="w-full bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Available In Stock!
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-400">
                    This item is available for reservation. Please proceed
                    through the standard issue process.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {outOfStockMessage && (
              <Card className="w-full bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="text-orange-800 dark:text-orange-300 flex items-center gap-2">
                    <PackageSearch className="h-5 w-5" />
                    Insufficient Stock
                  </CardTitle>
                  <CardDescription className="text-orange-700 dark:text-orange-400">
                    {outOfStockMessage}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {aiResponse && aiResponse.suggestions.length > 0 && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BotMessageSquare className="h-5 w-5 text-primary" />
                    Outsourcing Plan
                  </CardTitle>
                  <CardDescription>
                    This item is unavailable. Here is a suggested outsourcing
                    plan.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiResponse.suggestions.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {s.source}
                          </TableCell>
                          <TableCell>{s.equipment}</TableCell>
                          <TableCell className="text-center">
                            {s.quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {s.cost}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
