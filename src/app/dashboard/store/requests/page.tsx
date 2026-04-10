"use client";

import * as React from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  UserCheck,
  Calendar,
  MapPin,
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mockRequisitions } from "@/lib/mock-data";
import type { Requisition } from "@/lib/types";

export default function StoreRequestsInbox() {
  const { toast } = useToast();
  const [requisitions, setRequisitions] = React.useState<Requisition[]>([]);
  
  // State for Issuing Modal
  const [selectedReq, setSelectedReq] = React.useState<Requisition | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = React.useState(false);
  
  // Form State for Logistics Metadata
  const [logisticsType, setLogisticsType] = React.useState("Bodaboda");
  const [vehiclePlate, setVehiclePlate] = React.useState("");
  const [transporterName, setTransporterName] = React.useState("");
  const [transporterPhone, setTransporterPhone] = React.useState("");
  const [transporterResidence, setTransporterResidence] = React.useState("");
  const [companyEscort, setCompanyEscort] = React.useState("");
  const [deliveryVenue, setDeliveryVenue] = React.useState("");

  // Filters State for Issued Tab
  const [filterVenue, setFilterVenue] = React.useState("");
  const [filterLogisticsType, setFilterLogisticsType] = React.useState("All");
  const [filterDriver, setFilterDriver] = React.useState("");
  const [filterDateStr, setFilterDateStr] = React.useState(""); // YYYY-MM-DD

  React.useEffect(() => {
    // Load from mock state
    setRequisitions(mockRequisitions);
  }, []);

  const pendingReqs = requisitions.filter(r => r.status === "Pending");
  let issuedReqs = requisitions.filter(r => r.status === "Issued");

  // Apply Filters to Issued Requisitions
  if (filterVenue) {
    issuedReqs = issuedReqs.filter(r => r.deliveryVenue?.toLowerCase().includes(filterVenue.toLowerCase()) || r.eventName.toLowerCase().includes(filterVenue.toLowerCase()));
  }
  if (filterDriver) {
    issuedReqs = issuedReqs.filter(r => r.transporterName?.toLowerCase().includes(filterDriver.toLowerCase()) || r.vehicleNumberPlate?.toLowerCase().includes(filterDriver.toLowerCase()));
  }
  if (filterLogisticsType !== "All") {
    issuedReqs = issuedReqs.filter(r => r.logisticsType === filterLogisticsType);
  }
  if (filterDateStr) {
    issuedReqs = issuedReqs.filter(r => {
        if (!r.issuedDate) return false;
        // Basic match on YYYY-MM-DD
        return r.issuedDate.startsWith(filterDateStr);
    });
  }

  const handleOpenIssueModal = (req: Requisition) => {
    setSelectedReq(req);
    setIsIssueModalOpen(true);
    // Auto-fill venue from event name if applicable
    setDeliveryVenue(req.eventName); 
  };

  const handleConfirmIssue = () => {
    if (!selectedReq) return;

    if (!vehiclePlate || !transporterName || !transporterPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in the mandatory transporter details.",
        variant: "destructive"
      });
      return;
    }

    const updatedReq: Requisition = {
      ...selectedReq,
      status: "Issued",
      issuedDate: new Date().toISOString(),
      logisticsType: logisticsType as any,
      vehicleNumberPlate: vehiclePlate,
      transporterName,
      transporterPhone,
      transporterResidence,
      companyEscort,
      deliveryVenue
    };

    setRequisitions(prev => prev.map(r => r.id === selectedReq.id ? updatedReq : r));
    
    // Also inject into the mock data singleton so it persists across renders
    const mockRef = mockRequisitions.find(r => r.id === selectedReq.id);
    if (mockRef) {
        Object.assign(mockRef, updatedReq);
    }

    toast({
      title: "Equipment Issued & Tracked",
      description: `Requisition ${selectedReq.id} marked as Issued via ${logisticsType}.`,
    });

    setIsIssueModalOpen(false);
    
    // Clear form
    setVehiclePlate("");
    setTransporterName("");
    setTransporterPhone("");
    setTransporterResidence("");
    setCompanyEscort("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipment Requests Inbox</h1>
        <p className="text-muted-foreground mt-2">
          Receive, review, and issue equipment requested by the Field Operations Officers.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md h-12">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Requests
            <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">{pendingReqs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="issued" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Issued & Deployed
            <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-700">{issuedReqs.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* PENDING TAB */}
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Needs Attention</CardTitle>
              <CardDescription>Review item availability and issue equipment to transporters.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReqs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg">
                  <ClipboardList className="w-8 h-8 mb-4 opacity-50" />
                  <p>No pending equipment requests.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingReqs.map(req => (
                    <div key={req.id} className="border border-border p-6 rounded-xl relative overflow-hidden bg-white dark:bg-black/20 shadow-sm transition-all hover:border-primary/40">
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PENDING</div>
                      <div className="flex flex-col md:flex-row justify-between mb-6">
                        <div>
                          <h3 className="font-semibold text-lg">{req.eventName}</h3>
                          <div className="text-sm text-muted-foreground flex gap-4 mt-2">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Event: {req.eventDate}</span>
                            <span className="flex items-center gap-1"><UserCheck className="w-4 h-4"/> Requested by: {req.requestedBy}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <p className="text-xs text-muted-foreground">Req ID: {req.id}</p>
                          <p className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold mb-3 border-b pb-2">Requested Items</h4>
                        <ul className="space-y-2">
                          {req.items.map((item, i) => (
                            <li key={i} className="flex justify-between items-center text-sm">
                              <span className="font-medium">{item.itemName}</span>
                              <div className="flex items-center gap-4">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold">Qty: {item.quantity}</span>
                                <Badge variant={item.status === 'Available' ? 'outline' : 'destructive'} className="w-24 justify-center">
                                  {item.status}
                                </Badge>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button onClick={() => handleOpenIssueModal(req)} className="bg-primary hover:bg-primary/90 text-white font-medium px-8 w-full sm:w-auto">
                          Issue Equipment & Add Transport
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ISSUED TAB - WITH ADVANCED FILTERS */}
        <TabsContent value="issued" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployed Equipment Logs</CardTitle>
              <CardDescription>Track transporter details and escort personnel for all issued equipment.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* ADVANCED FILTERS BAR */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-muted/40 rounded-lg border border-border">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Filter by Date</label>
                  <Input type="date" value={filterDateStr} onChange={e => setFilterDateStr(e.target.value)} className="bg-white dark:bg-black/50" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Venue</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search venue..." value={filterVenue} onChange={e => setFilterVenue(e.target.value)} className="pl-9 bg-white dark:bg-black/50" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Logistics</label>
                  <Select value={filterLogisticsType} onValueChange={setFilterLogisticsType}>
                    <SelectTrigger className="bg-white dark:bg-black/50">
                      <SelectValue placeholder="All Transports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Vehicle Types</SelectItem>
                      <SelectItem value="Bodaboda">Bodaboda</SelectItem>
                      <SelectItem value="TukTuk">TukTuk</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Company Vehicle">Company Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Driver / Plate</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Name or Plt No." value={filterDriver} onChange={e => setFilterDriver(e.target.value)} className="pl-9 bg-white dark:bg-black/50" />
                  </div>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Issued On</TableHead>
                      <TableHead>Event & Venue</TableHead>
                      <TableHead>Logistics Info</TableHead>
                      <TableHead>Escort Staff</TableHead>
                      <TableHead className="text-right">Items Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issuedReqs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No issued deployments match these filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      issuedReqs.map(req => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.issuedDate ? format(new Date(req.issuedDate), "MMM dd, yyyy HH:mm") : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold">{req.eventName}</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center"><MapPin className="w-3 h-3 mr-1 inline"/> {req.deliveryVenue}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200"><Truck className="w-3 h-3 mr-1"/> {req.logisticsType}</Badge>
                                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{req.vehicleNumberPlate}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{req.transporterName} • {req.transporterPhone}</div>
                          </TableCell>
                          <TableCell>
                             <div className="text-sm font-medium">{req.companyEscort || "Unescorted"}</div>
                          </TableCell>
                          <TableCell className="text-right">
                             <div className="font-bold text-lg">{req.items.length}</div>
                             <div className="text-xs text-muted-foreground">boxes/units</div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ISSUANCE LOGISTICS MODAL */}
      <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Issue Equipment & Logistics Routing</DialogTitle>
            <DialogDescription>Assign the transporter and escort details for Requisition {selectedReq?.id}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-4">
                <Truck className="w-6 h-6 text-primary mt-1" />
                <div>
                    <h4 className="font-semibold">Transport Protocol</h4>
                    <p className="text-sm text-muted-foreground">All items leaving the warehouse must be tied to a registered vehicle plate and driver contact for accountability.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Logistics Type <span className="text-red-500">*</span></label>
                    <Select value={logisticsType} onValueChange={setLogisticsType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Vehicle Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bodaboda">Bodaboda</SelectItem>
                            <SelectItem value="TukTuk">TukTuk</SelectItem>
                            <SelectItem value="Truck">Truck</SelectItem>
                            <SelectItem value="Company Vehicle">Company Vehicle</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Number Plate <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g. UBA 123X" value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Transporter Name <span className="text-red-500">*</span></label>
                    <Input placeholder="Driver full name" value={transporterName} onChange={e => setTransporterName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Transporter Telephone <span className="text-red-500">*</span></label>
                    <Input placeholder="07XX XXX XXX" value={transporterPhone} onChange={e => setTransporterPhone(e.target.value)} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Transporter Area of Residence</label>
                <Input placeholder="Information for Bodaboda/external hires..." value={transporterResidence} onChange={e => setTransporterResidence(e.target.value)} />
            </div>

            <div className="space-y-2 border-t pt-4">
                <label className="text-sm font-medium">PEMS Company Escort Personnel</label>
                <div className="flex gap-2 items-center">
                    <UserCheck className="w-5 h-5 text-muted-foreground" />
                    <Input placeholder="Staff assigned to accompany the delivery to venue" value={companyEscort} onChange={e => setCompanyEscort(e.target.value)} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Target Delivery Venue</label>
                <Input placeholder="Final destination" value={deliveryVenue} onChange={e => setDeliveryVenue(e.target.value)} />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmIssue} className="bg-primary hover:bg-primary/90 text-white font-bold">
               Confirm & Issue Equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
