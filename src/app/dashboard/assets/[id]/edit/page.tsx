
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
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
import { CONDITIONS, initialInventory } from "@/lib/mock-data";
import { InventoryStatus } from "@/types";


const assetFormSchema = z.object({
  itemName: z.string().min(2, "Asset name is required."),
  category: z.string().min(1, "Please select a category."),
  datePurchased: z.date(),
  condition: z.string().min(1, "Please select a condition."),
  issuedTo: z.string().optional(),
  status: z.string().min(1, "Please select a status.")
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

export default function EditAssetPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const asset = React.useMemo(() => {
    return initialInventory.find(a => a.id === params.id);
  }, [params.id]);


  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    values: asset ? {
        itemName: asset.itemName,
        category: asset.category,
        datePurchased: new Date(asset.datePurchased),
        condition: asset.condition,
        issuedTo: asset.issuedTo || "",
        status: asset.status
    } : undefined
  });
  
  if (!asset) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Asset Not Found</CardTitle>
                    <CardDescription>The requested asset could not be found.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/assets">Back to Asset List</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  function onSubmit(data: AssetFormValues) {
    console.log(data);
    toast({
      title: "Asset Updated",
      description: `Asset "${data.itemName}" (${params.id}) has been updated.`,
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
                    <Link href="/dashboard/assets"><ArrowLeft className="h-4 w-4" /></Link>
                  </Button>
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      Edit Asset
                    </CardTitle>
                    <CardDescription>
                      Editing asset with ID: <span className="font-mono">{params.id}</span>
                    </CardDescription>
                  </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                       <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                           <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="datePurchased"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Purchase Date</FormLabel>
                             <FormControl>
                                <Input value={format(field.value, "PPP")} disabled />
                             </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
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
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Issued">Issued</SelectItem>
                                    <SelectItem value="Under Repair">Under Repair</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
            </CardContent>
            <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">
                            <Save className="mr-2" />
                            Save Changes
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will update the asset details in the system.
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
