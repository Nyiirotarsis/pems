
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, Trash2, ArrowLeft, Save, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { mockQuotations } from "@/lib/mock-data";


const quotationItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  quantity: z.coerce.number().min(1, "Qty must be at least 1."),
  unitPrice: z.coerce.number().min(0, "Price must be a positive number."),
});

const quotationFormSchema = z.object({
  quotationNumber: z.string(),
  date: z.date(),
  clientName: z.string().min(2, "Client name is required."),
  clientAddress: z.string().min(5, "Client address is required."),
  clientEmail: z.string().email("Invalid email address."),
  projectReference: z.string().min(2, "Project reference is required."),
  preparedBy: z.string(),
  items: z.array(quotationItemSchema).min(1, "Please add at least one item."),
  validFor: z.string(),
  paymentTerms: z.string(),
  deliveryTimeline: z.string(),
  attachment: z.any().optional(),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

export default function EditQuotationPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const quotation = React.useMemo(() => mockQuotations.find(q => q.id === params.id), [params.id]);

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    // A more robust solution would fetch full quotation details here, including items
    // For this mock, we'll use some default items if none are present
    values: quotation ? {
      ...quotation,
      date: new Date(quotation.date),
      quotationNumber: quotation.number,
      projectReference: "Corporate Launch",
      clientName: "ABC Media Ltd",
      clientAddress: "Plot 45, Kampala Road",
      clientEmail: "info@abcmedia.com",
      preparedBy: "Accountant Name",
      items: [{ description: quotation.service, quantity: 1, unitPrice: quotation.amount }],
      validFor: "30 days",
      paymentTerms: "50% upfront, 50% after event",
      deliveryTimeline: "Within 5 days after confirmation",
    } : undefined,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const fileRef = form.register("attachment");

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
  });

  const calculations = React.useMemo(() => {
    const subtotal = watchedItems.reduce(
      (acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0),
      0
    );
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;
    return { subtotal, tax, grandTotal };
  }, [watchedItems]);

  if (!quotation) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Quotation Not Found</CardTitle>
                    <CardDescription>The requested quotation could not be found.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline">
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  function onSubmit(data: QuotationFormValues) {
    console.log(data);
    toast({
      title: "Quotation Updated",
      description: `Quotation ${data.quotationNumber} has been updated.`,
    });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                  <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                  </Button>
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      Edit Quotation {quotation.number}
                    </CardTitle>
                    <CardDescription>
                      Update the details for this quotation.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="secondary">
                                <Save className="mr-2" />
                                Save Changes
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will update the quotation details.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button type="button" variant="outline" onClick={() => alert("Generate PDF clicked")}>Generate PDF</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Header section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="quotationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quotation Number</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
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
                  name="projectReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event / Project Reference</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Corporate Launch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preparedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prepared By</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               {/* Client Details section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Client Details</h3>
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name / Company</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Media Ltd" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@abcmedia.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                      control={form.control}
                      name="clientAddress"
                      render={({ field }) => (
                        <FormItem className="flex flex-col h-full">
                          <FormLabel>Client Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Plot 45, Kampala Road" className="flex-grow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
              </div>

              {/* Items Table section */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Quotation Items</h3>
                <div className="border rounded-md">
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2">Item Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="e.g., LED Screen Hire" {...field} />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                           <TableCell>
                             <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                   <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                           <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                   <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {(
                              (watchedItems[index]?.quantity || 0) *
                              (watchedItems[index]?.unitPrice || 0)
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              disabled={fields.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

               {/* Totals Section */}
                <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">{calculations.subtotal.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax (18% VAT)</span>
                            <span className="font-medium">{calculations.tax.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Grand Total</span>
                            <span>{calculations.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

              {/* Terms & Conditions section */}
              <div>
                 <h3 className="font-semibold text-lg mb-2">Terms & Conditions</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="validFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quotation valid for</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                           <FormMessage/>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="deliveryTimeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Timeline</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                           <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                       <FormField
                          control={form.control}
                          name="paymentTerms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Terms</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                               <FormMessage/>
                            </FormItem>
                          )}
                        />
                    </div>
                 </div>
              </div>
              
            </CardContent>
            <CardFooter>
                <FormField
                    control={form.control}
                    name="attachment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attach Supporting Document</FormLabel>
                            <FormControl>
                            <Input 
                                type="file" 
                                {...fileRef}
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
