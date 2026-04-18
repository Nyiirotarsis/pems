"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Truck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import PEMSDashboard from "@/components/pems-dashboard";
import { mockRequisitions } from "@/lib/mock-data";
import type { Requisition, RequisitionItem } from "@/lib/types";

export default function FieldOpsReturnsPage() {
  const { toast } = useToast();
  const [requisitions, setRequisitions] = React.useState<Requisition[]>([]);
  
  // Modal State
  const [selectedReq, setSelectedReq] = React.useState<Requisition | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);

  // Form State
  const [itemConditions, setItemConditions] = React.useState<Record<string, { condition: string, notes: string }>>({});
  const [eventEndDate, setEventEndDate] = React.useState("");
  const [returnLogisticsType, setReturnLogisticsType] = React.useState("Company Vehicle");
  const [returnVehiclePlate, setReturnVehiclePlate] = React.useState("");
  const [returnTransporterName, setReturnTransporterName] = React.useState("");
  const [returnTransporterPhone, setReturnTransporterPhone] = React.useState("");
  const [returnEscort, setReturnEscort] = React.useState("");

  React.useEffect(() => {
    setRequisitions(mockRequisitions);
  }, []);

  const activeDeployments = requisitions.filter(r => r.status === "Issued");

  const openReturnModal = (req: Requisition) => {
    setSelectedReq(req);
    // Initialize item states to "Good"
    const initialConditions: Record<string, { condition: string, notes: string }> = {};
    req.items.forEach((item, idx) => {
      // Using index as simple key since itemNames might duplicate, but ideally itemId
      initialConditions[idx] = { condition: "Good", notes: "" };
    });
    setItemConditions(initialConditions);
    
    // Auto-fill some reverse logistics if applicable (defaulting to outbound data)
    setReturnLogisticsType(req.logisticsType || "Truck");
    setReturnVehiclePlate(req.vehicleNumberPlate || "");
    setReturnTransporterName(req.transporterName || "");
    setReturnTransporterPhone(req.transporterPhone || "");
    setReturnEscort(req.companyEscort || "");
    setEventEndDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    
    setIsReturnModalOpen(true);
  };

  const handleUpdateItemCondition = (idx: number, field: 'condition' | 'notes', value: string) => {
    setItemConditions(prev => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [field]: value
      }
    }));
  };

  const submitReturn = () => {
    if (!selectedReq) return;

    // Build the updated items array
    const updatedItems: RequisitionItem[] = selectedReq.items.map((item, idx) => ({
      ...item,
      returnCondition: itemConditions[idx].condition as any,
      damageNotes: itemConditions[idx].notes
    }));

    const updatedReq: Requisition = {
      ...selectedReq,
      status: "Pending Return",
      items: updatedItems,
      eventEndDate,
      returnLogisticsType: returnLogisticsType as any,
      returnVehiclePlate,
      returnTransporterName,
      returnTransporterPhone,
      returnEscort
    };

    setRequisitions(prev => prev.map(r => r.id === selectedReq.id ? updatedReq : r));
    
    // Mutate mock db
    const mockRef = mockRequisitions.find(r => r.id === selectedReq.id);
    if (mockRef) {
        Object.assign(mockRef, updatedReq);
    }

    toast({
      title: "Reverse Logistics Initiated",
      description: `Equipment mapped and flagged as Pending Return for the Store Manager.`,
    });

    setIsReturnModalOpen(false);
  };

  return (
    <PEMSDashboard initialRole="Field Operational Officer">
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/field-ops">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Active Deployments & Returns</h1>
            <p className="text-muted-foreground mt-1">
              Close out completed events by documenting on-site conditions and tracking reverse logistics.
            </p>
          </div>
        </div>

        {activeDeployments.length === 0 ? (
          <Card className="border-dashed shadow-none bg-muted/20 text-center py-12">
             <ArrowRightLeft className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
             <h3 className="text-lg font-semibold">No Active Deployments</h3>
             <p className="text-muted-foreground">All your requested equipment is safely accounted for.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {activeDeployments.map(req => (
              <Card key={req.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {req.eventName}
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">Deployed</Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2 text-sm">
                        <MapPin className="w-3 h-3 mr-1"/> {req.deliveryVenue}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                       <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">ID: {req.id}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Truck className="w-4 h-4"/> Outbound Logistics</h4>
                    <p className="text-sm text-muted-foreground">
                      Transported via <strong>{req.logisticsType}</strong> ({req.vehicleNumberPlate}).<br/>
                      Driver: {req.transporterName} <br/>
                      Escort: {req.companyEscort}
                    </p>
                  </div>
                  <div className="flex-1">
                     <h4 className="text-sm font-semibold mb-2">Equipment Loadout</h4>
                     <ul className="text-sm space-y-1">
                        {req.items.slice(0, 3).map((item, i) => (
                           <li key={i} className="flex justify-between border-b pb-1">
                             <span className="truncate pr-4">{item.itemName}</span>
                             <span className="font-bold">x{item.quantity}</span>
                           </li>
                        ))}
                        {req.items.length > 3 && (
                            <li className="text-xs text-muted-foreground pt-1 italic">+ {req.items.length - 3} more items</li>
                        )}
                     </ul>
                  </div>
                  <div className="flex items-end md:items-center">
                    <Button onClick={() => openReturnModal(req)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Start Pack-Down Return
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>

      <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post-Event Reverse Logistics Tracker</DialogTitle>
            <DialogDescription>Verify the condition of {selectedReq?.eventName} equipment and map the return vehicle.</DialogDescription>
          </DialogHeader>

          {selectedReq && (
            <div className="space-y-6 py-4">
              {/* ITEM CONDITION SECTION */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  1. On-Site Inventory Check
                </h3>
                <div className="space-y-4">
                  {selectedReq.items.map((item, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-muted/10">
                       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-3">
                          <div>
                            <span className="font-semibold">{item.itemName}</span>
                            <Badge variant="secondary" className="ml-2">Qty: {item.quantity}</Badge>
                          </div>
                          
                          <Select 
                            value={itemConditions[idx]?.condition} 
                            onValueChange={(val) => handleUpdateItemCondition(idx, 'condition', val)}
                          >
                            <SelectTrigger className="w-[150px] bg-white">
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Good">🟢 Good / Working</SelectItem>
                              <SelectItem value="Fair">🟡 Fair / Used</SelectItem>
                              <SelectItem value="Damaged">🔴 Damaged</SelectItem>
                              <SelectItem value="Lost">⚫ Lost on Site</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
                       
                       {/* Show damage notes ONLY if condition is NOT Good */}
                       {itemConditions[idx]?.condition && itemConditions[idx]?.condition !== "Good" && (
                         <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                           <Textarea 
                             placeholder={`Please describe what happened to the ${item.itemName}...`}
                             className="text-sm bg-white border-red-200 focus-visible:ring-red-500"
                             value={itemConditions[idx]?.notes}
                             onChange={(e) => handleUpdateItemCondition(idx, 'notes', e.target.value)}
                           />
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </div>

              {/* REVERSE LOGISTICS SECTION */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  2. Return Transport Protocol
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Event Actual End Date</label>
                      <Input type="datetime-local" value={eventEndDate} onChange={e => setEventEndDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Return Vehicle Type</label>
                      <Select value={returnLogisticsType} onValueChange={setReturnLogisticsType}>
                          <SelectTrigger><SelectValue placeholder="Vehicle" /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Bodaboda">Bodaboda</SelectItem>
                              <SelectItem value="TukTuk">TukTuk</SelectItem>
                              <SelectItem value="Truck">Truck</SelectItem>
                              <SelectItem value="Company Vehicle">Company Vehicle</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Return Vehicle Plate</label>
                      <Input value={returnVehiclePlate} onChange={e => setReturnVehiclePlate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Driver / Transporter Name</label>
                      <Input value={returnTransporterName} onChange={e => setReturnTransporterName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Driver Phone</label>
                      <Input value={returnTransporterPhone} onChange={e => setReturnTransporterPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Returning Escort (Staff)</label>
                      <Input value={returnEscort} onChange={e => setReturnEscort(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 border-t pt-4">
             <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>Cancel</Button>
             <Button onClick={submitReturn} className="bg-primary text-white">Submit Return to Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PEMSDashboard>
  );
}
