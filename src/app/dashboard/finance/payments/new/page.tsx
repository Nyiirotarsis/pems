
"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Calendar as CalendarIcon, DollarSign, Paperclip, Receipt } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { mockInvoices, mockPayments } from "@/lib/mock-data";
import { updateInvoiceStatus } from "@/app/actions";

const paymentFormSchema = z.object({
  invoiceNumber: z.string().min(1, "Please select an invoice."),
  quotationNumber: z.string().optional(),
  paymentDate: z.date(),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  method: z.enum(["Bank", "Cash", "Mobile Money"]),
  receipt: z.any().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function NewPaymentPage() {
  const { toast } = useToast();
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentDate: new Date(),
      amount: 0,
    },
  });
  
  const fileRef = form.register("receipt");
  
  const watchedInvoiceNumber = useWatch({
    control: form.control,
    name: "invoiceNumber",
  });
  
  const watchedAmount = useWatch({
    control: form.control,
    name: "amount",
  });

  const selectedInvoice = React.useMemo(() => {
    const inv = mockInvoices.find(i => i.number === watchedInvoiceNumber)
    if (inv) {
        form.setValue("quotationNumber", inv.quotationNumber);
    }
    return inv;
  }, [watchedInvoiceNumber, form]);

  const paidAmount = React.useMemo(() => {
    if (!selectedInvoice) return 0;
    return mockPayments
      .filter(p => p.invoiceNumber === selectedInvoice.number)
      .reduce((acc, p) => acc + p.amount, 0);
  }, [selectedInvoice]);

  const balance = selectedInvoice ? selectedInvoice.amount - paidAmount : 0;
  const newBalance = balance - (watchedAmount || 0);

  async function onSubmit(data: PaymentFormValues) {
    // In a real app, this would be a DB transaction
    const newPayment = {
      id: `P${String(mockPayments.length + 1).padStart(3, '0')}`,
      date: format(data.paymentDate, "yyyy-MM-dd"),
      ...data
    };
    mockPayments.push(newPayment);

    const allPaymentsForInvoice = mockPayments.filter(p => p.invoiceNumber === data.invoiceNumber);
    await updateInvoiceStatus(data.invoiceNumber, allPaymentsForInvoice);
    
    toast({
      title: "Payment Recorded",
      description: `Payment of ${data.amount} for invoice ${data.invoiceNumber} has been recorded.`,
    });

    form.reset({
        paymentDate: new Date(),
        amount: 0,
        invoiceNumber: '',
        quotationNumber: '',
        method: undefined,
        receipt: undefined
    });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
               <div className="flex items-center gap-4">
                  <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/finance"><ArrowLeft className="h-4 w-4" /></Link>
                  </Button>
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      Record Payment & Issue Receipt
                    </CardTitle>
                    <CardDescription>
                      Fill in the details to record a client payment.
                    </CardDescription>
                  </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an invoice to pay" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockInvoices.filter(i => i.status !== 'Paid').map((invoice) => (
                              <SelectItem key={invoice.id} value={invoice.number}>
                                {invoice.number} ({invoice.supplier}) - Amount: ${invoice.amount.toLocaleString()}
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
                      name="quotationNumber"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Quotation No.</FormLabel>
                          <FormControl>
                          <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
               </div>
                
                {selectedInvoice && (
                    <Card className="bg-muted/50">
                        <CardContent className="p-4 grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-muted-foreground">Total Amount</p>
                                <p className="font-bold text-lg">${selectedInvoice.amount.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="font-medium text-muted-foreground">Current Balance</p>
                                <p className="font-bold text-lg text-destructive">${balance.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="font-medium text-muted-foreground">New Balance</p>
                                <p className="font-bold text-lg text-green-600">${newBalance.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount Paid</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Date</FormLabel>
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
                 <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Bank">Bank Transfer</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="receipt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attach Proof of Payment</FormLabel>
                            <FormControl>
                            <Input 
                                type="file" 
                                {...fileRef}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
            <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">
                            <Receipt className="mr-2" />
                            Record Payment & Issue Receipt
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will record a new payment and update the invoice status.
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
