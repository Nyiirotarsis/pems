
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { issueFormSchema, returnFormSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import type { InventoryItem, Condition, InventoryIssue } from "@/types";
import React from "react";
import { USERS } from "@/lib/mock-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";

const CONDITIONS: Condition[] = ["Good", "Fair", "Damaged", "Faulty"];

type TransactionsViewProps = {
  inventory: InventoryItem[];
  inventoryIssues: InventoryIssue[];
  onIssue: (values: z.infer<typeof issueFormSchema>) => void;
  onReturn: (values: z.infer<typeof returnFormSchema>) => void;
};

export function TransactionsView({
  inventory,
  inventoryIssues,
  onIssue,
  onReturn,
}: TransactionsViewProps) {
  const issueForm = useForm<z.infer<typeof issueFormSchema>>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: { 
      dateOut: new Date(),
      itemsIssued: [{ itemId: "", quantityOut: 1 }],
      remarks: "",
    },
  });

  const returnForm = useForm<z.infer<typeof returnFormSchema>>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
       dateIn: new Date(),
       remarks: ""
    },
  });

  function handleIssueSubmit(values: z.infer<typeof issueFormSchema>) {
    // Add validation logic here before calling onIssue
    onIssue(values);
    issueForm.reset({
      dateOut: new Date(),
      category: "",
      itemsIssued: [{ itemId: "", quantityOut: 1 }],
      issuedTo: "",
      venue: "",
      remarks: ""
    });
  }

  function handleReturnSubmit(values: z.infer<typeof returnFormSchema>) {
    onReturn(values);
    returnForm.reset({
        dateIn: new Date(),
        issueId: "",
        itemsReturned: [],
        remarks: "",
    });
  }

  return (
    <Tabs defaultValue="issue">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="issue">Issue Equipment</TabsTrigger>
        <TabsTrigger value="return">Return Equipment</TabsTrigger>
      </TabsList>
      <TabsContent value="issue">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Issue Equipment</CardTitle>
            <CardDescription>
              Record items taken by staff for events.
            </CardDescription>
          </CardHeader>
          <Form {...issueForm}>
            <form onSubmit={issueForm.handleSubmit(handleIssueSubmit)}>
              <CardContent className="space-y-4">
                <IssueFormFields form={issueForm} inventory={inventory} />
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button">Issue Items</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will mark the selected items as "Out".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={issueForm.handleSubmit(handleIssueSubmit)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="return">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Return Equipment</CardTitle>
            <CardDescription>
              Log items returned and update their condition.
            </CardDescription>
          </CardHeader>
          <Form {...returnForm}>
            <form onSubmit={returnForm.handleSubmit(handleReturnSubmit)}>
              <CardContent className="space-y-4">
                <ReturnFormFields form={returnForm} inventoryIssues={inventoryIssues} />
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button">Receive Items</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will return the selected items to the
                        inventory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={returnForm.handleSubmit(handleReturnSubmit)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function IssueFormFields({ form, inventory }: { form: any; inventory: InventoryItem[] }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "itemsIssued",
    });

    const watchedCategory = form.watch("category");
    const availableItems = React.useMemo(() => 
        inventory.filter(i => 
            i.category === watchedCategory && 
            i.status === 'Available' && 
            i.condition !== 'Faulty'
        ), 
    [inventory, watchedCategory]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="dateOut"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Date Out</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP")
                                ) : (
                                <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {[...new Set(inventory.map(i => i.category))].map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

             <div>
                <FormLabel>Items to Issue</FormLabel>
                <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                         <FormField
                            control={form.control}
                            name={`itemsIssued.${index}.itemId`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an item" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableItems.map(item => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.itemName} (Avail: {item.quantityAvailable})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`itemsIssued.${index}.quantityOut`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="number" placeholder="Qty" className="w-20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                </div>
                 <Button type="button" variant="default" size="sm" className="mt-2" onClick={() => append({ itemId: "", quantityOut: 1 })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="issuedTo"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Issued To (Officer)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {USERS.map(user => (
                                    <SelectItem key={user.id} value={user.username}>
                                        {user.username} ({user.role})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Venue/Event Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., MTN Expo 2025" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Optional remarks..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

function ReturnFormFields({ form, inventoryIssues }: { form: any; inventoryIssues: InventoryIssue[] }) {
    
    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "itemsReturned",
    });

    const watchedIssueId = form.watch("issueId");

    React.useEffect(() => {
        if (watchedIssueId) {
            const issue = inventoryIssues.find(i => i.issueId === watchedIssueId);
            if (issue) {
                const itemsToReturn = issue.itemsIssued.map(item => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    condition: "Good"
                }));
                replace(itemsToReturn);
            }
        }
    }, [watchedIssueId, inventoryIssues, replace]);
    
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="issueId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Issue ID / Reference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select an issue to return" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {inventoryIssues.filter(i => i.status === 'Out').map(issue => (
                                <SelectItem key={issue.issueId} value={issue.issueId}>
                                    {issue.issueId} ({issue.venue})
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateIn"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Date In</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP")
                                ) : (
                                <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <div>
                <FormLabel>Returned Items</FormLabel>
                {fields.length > 0 ? (
                    <div className="space-y-2 mt-2">
                        {fields.map((field, index) => (
                             <div key={field.id} className="flex items-center gap-4 p-2 border rounded-md">
                                <span className="flex-1 font-medium">{(field as any).itemName}</span>
                                 <FormField
                                    control={form.control}
                                    name={`itemsReturned.${index}.condition`}
                                    render={({ field }) => (
                                        <FormItem className="w-[180px]">
                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select condition" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {CONDITIONS.map((c) => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                ) : <p className="text-sm text-muted-foreground mt-2">Select an Issue ID to see items.</p>}
            </div>
             <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Note any changes or damages..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}
