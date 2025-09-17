
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { transactionFormSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import type { InventoryItem, Condition, Asset } from "@/types";
import React from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const CONDITIONS: Condition[] = ["Good", "Damaged", "Lost", "Faulty"];

type TransactionsViewProps = {
  inventory: (InventoryItem & { available: number; total: number })[];
  onIssue: (values: z.infer<typeof transactionFormSchema>) => void;
  onReturn: (values: z.infer<typeof transactionFormSchema>) => void;
};

export function TransactionsView({
  inventory,
  onIssue,
  onReturn,
}: TransactionsViewProps) {
  const issueForm = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: { date: new Date(), assetIds: [] },
  });

  const returnForm = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: { date: new Date(), assetIds: [] },
  });

  function handleIssueSubmit(values: z.infer<typeof transactionFormSchema>) {
    const item = inventory.find((i) => i.id === parseInt(values.equipmentId));
     if (!item) return;
    const availableCount = item.assets.filter(a => a.status === 'Available' && a.condition === 'Good').length;
    if (availableCount < values.assetIds.length) {
      issueForm.setError("assetIds", {
        type: "manual",
        message: `Not enough in stock. Only ${availableCount} available.`,
      });
      return;
    }
    onIssue(values);
    issueForm.reset({ date: new Date(), assetIds: [] });
  }

  function handleReturnSubmit(values: z.infer<typeof transactionFormSchema>) {
    onReturn(values);
    returnForm.reset({ date: new Date(), assetIds: [] });
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
                <TransactionFormFields
                  form={issueForm}
                  inventory={inventory}
                  type="issue"
                />
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button">Issue Item(s)</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will mark {issueForm.getValues("assetIds").length}{" "}
                        item(s) as issued.
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
                <TransactionFormFields
                  form={returnForm}
                  inventory={inventory}
                  type="return"
                />
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button">Receive Item(s)</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will return{" "}
                        {returnForm.getValues("assetIds").length} item(s) to the
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


function TransactionFormFields({ form, inventory, type }: { form: any; inventory: InventoryItem[]; type: "issue" | "return"; }) {
  const selectedEquipmentId = form.watch("equipmentId");
  const selectedCondition = form.watch("condition");
  const selectedAssetIds = form.watch("assetIds");

  const [assetsToList, setAssetsToList] = React.useState<Asset[]>([]);

  React.useEffect(() => {
    if (selectedEquipmentId) {
      const item = inventory.find(i => i.id.toString() === selectedEquipmentId);
      if (item) {
        const relevantAssets = type === 'issue'
          ? item.assets.filter(a => a.status === 'Available')
          : item.assets.filter(a => a.status === 'Issued');
        setAssetsToList(relevantAssets);
      } else {
        setAssetsToList([]);
      }
      form.setValue("assetIds", []); // Reset selection when equipment changes
    }
  }, [selectedEquipmentId, inventory, type, form]);
  
  const handleCheckboxChange = (assetId: string, checked: boolean) => {
      const currentAssetIds = selectedAssetIds || [];
      
      const isFaultyFlow = type === 'return' && ['Faulty', 'Damaged', 'Lost'].includes(selectedCondition);

      if (isFaultyFlow) {
           form.setValue("assetIds", checked ? [assetId] : []);
      } else {
          const newAssetIds = checked
            ? [...currentAssetIds, assetId]
            : currentAssetIds.filter((id: string) => id !== assetId);
          form.setValue("assetIds", newAssetIds);
      }
  }
  
  const isMultiSelectDisabled = type === 'return' && ['Faulty', 'Damaged', 'Lost'].includes(selectedCondition) && selectedAssetIds.length > 0;


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="equipmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name} ({type === 'issue' ? `Available: ${item.assets.filter(a => a.status === 'Available').length}` : `Issued: ${item.assets.filter(a => a.status === 'Issued').length}`})
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  {type === "issue" ? "Date Out" : "Date In"}
                </FormLabel>
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
      {type === "return" && (
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <Select onValueChange={(value) => { field.onChange(value); form.setValue("assetIds", []) }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select returned condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {selectedEquipmentId && (
        <FormField
            control={form.control}
            name="assetIds"
            render={() => (
                <FormItem>
                    <FormLabel>Select Assets ({selectedAssetIds?.length || 0} selected)</FormLabel>
                     {isMultiSelectDisabled && <p className="text-sm text-destructive">Only one faulty/damaged asset can be returned at a time.</p>}
                    <ScrollArea className="h-48 rounded-md border p-2">
                         <div className="space-y-2">
                         {assetsToList.length > 0 ? assetsToList.map((asset) => (
                            <div key={asset.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={asset.id}
                                    checked={selectedAssetIds?.includes(asset.id)}
                                    onCheckedChange={(checked) => handleCheckboxChange(asset.id, !!checked)}
                                    disabled={isMultiSelectDisabled && !selectedAssetIds?.includes(asset.id)}
                                />
                                <label
                                    htmlFor={asset.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {asset.id}
                                    {type === 'return' && asset.assignedTo && <Badge variant="outline" className="ml-2">{asset.assignedTo}</Badge>}
                                </label>
                            </div>
                         )) : <p className="text-sm text-muted-foreground text-center py-4">No assets to show.</p>}
                         </div>
                    </ScrollArea>
                    <FormMessage />
                </FormItem>
            )}
        />
      )}
    </>
  );
}

