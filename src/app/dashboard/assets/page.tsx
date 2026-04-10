
"use client";

import * as React from "react";
import {
  MoreHorizontal,
  PlusCircle,
  FileDown,
  Trash2,
  Edit,
  ArrowLeft,
  User,
  Wrench,
  Package,
  QrCode,
  Camera,
  PackageX,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  initialInventory,
  USERS,
} from "@/lib/mock-data";
import type { InventoryItem } from "@/types";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const QrScanner = dynamic(() => import('@/components/dashboard/qr-scanner').then(mod => mod.QrScanner), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="ml-2">Loading Scanner...</p>
    </div>
  ),
});


type StatusFilter = "All" | "Available" | "Issued" | "Under Repair";

const statusColors: Record<string, string> = {
  Available:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
  Issued:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
  "Under Repair":
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700",
  Archived:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700",
};

const statusIcons: Record<string, React.ElementType> = {
  Available: Package,
  Issued: User,
  "Under Repair": Wrench,
  Archived: PackageX,
};

function StatusBadge({ status }: { status: string }) {
  const Icon = statusIcons[status] || Package;
  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-normal", statusColors[status])}
    >
      <Icon className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  );
}

export default function AssetsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [assets, setAssets] = React.useState<InventoryItem[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("All");
  const [selectedAssetForQr, setSelectedAssetForQr] = React.useState<InventoryItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);

  React.useEffect(() => {
    // The initialInventory is now the list of all assets
    setAssets(initialInventory);
  }, []);

  const filteredAssets = assets.filter((asset) => {
    if (statusFilter === "All") return true;
    return asset.status === statusFilter;
  });
  
  const getAssignedToNameString = (username?: string | null) => {
    if (!username) return "Store Room";
    const user = USERS.find(u => u.username === username);
    return user ? user.role : username;
  }

  const getAssignedToName = (username?: string | null) => {
    if (!username) return <span className="text-muted-foreground">Store Room</span>;
    const user = USERS.find(u => u.username === username);
    return user ? user.role : username;
  }

  const handleUpdateCondition = (id: string, newCondition: string) => {
    // 1. Update the local component state for instant visual feedback
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === id ? { ...asset, condition: newCondition as any } : asset
      )
    );

    // 2. Update the singleton mock array so the state persists across portals (e.g. Field Ops)
    const targetAsset = initialInventory.find(a => a.id === id);
    if (targetAsset) {
      targetAsset.condition = newCondition as any;
    }

    toast({
      title: "Equipment Condition Updated",
      description: `The condition for ${id} is now ${newCondition}.`,
    });
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);

    try {
        const url = new URL(decodedText);
        if (url.origin === window.location.origin && url.pathname.startsWith('/dashboard/assets/verify/')) {
            router.push(decodedText);
            return;
        }
    } catch (_) {
        // Not a valid URL, likely a raw ID
    }

    // If it's just an ID, navigate to the verification page
    router.push(`/dashboard/assets/verify/${decodedText}`);
  }

  const handleExport = () => {
    if (filteredAssets.length === 0) {
      toast({
        variant: "destructive",
        title: "No data to export",
        description: "There are no assets matching the current filter.",
      });
      return;
    }

    const headers = ["Asset ID", "Asset Name", "Category", "Location", "Assigned To", "Purchase Date", "Condition", "Status"];
    const csvRows = [
      headers.join(','),
      ...filteredAssets.map(asset => [
        `"${asset.id}"`,
        `"${asset.itemName}"`,
        `"${asset.category}"`,
        `"${asset.location}"`,
        `"${getAssignedToNameString(asset.issuedTo)}"`,
        `"${asset.datePurchased}"`,
        `"${asset.condition}"`,
        `"${asset.status}"`,
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'assets.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${filteredAssets.length} assets have been exported to CSV.`,
    })
  };
  
  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="icon">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <CardTitle className="font-headline text-2xl">
                  Asset Management
                </CardTitle>
                <CardDescription>
                  Track and manage individual assets across the organization.
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Issued">Issued</SelectItem>
                  <SelectItem value="Under Repair">Under Repair</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="mr-2" />
                Export
              </Button>
              <Button variant="secondary" onClick={() => setIsScannerOpen(true)}>
                <Camera className="mr-2" />
                Scan Equipment
              </Button>
              <Button asChild>
                <Link href="/dashboard/assets/new">
                    <PlusCircle className="mr-2" />
                    Add Asset
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-mono text-xs">{asset.id}</TableCell>
                  <TableCell className="font-medium">{asset.itemName}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{getAssignedToName(asset.issuedTo)}</TableCell>
                  <TableCell>{asset.datePurchased}</TableCell>
                  <TableCell>
                    <Select
                      value={asset.condition}
                      onValueChange={(val) => handleUpdateCondition(asset.id, val)}
                    >
                      <SelectTrigger 
                        className={cn("w-[130px] h-8 text-xs font-medium border-0 shadow-sm", 
                          ['Good', 'New'].includes(asset.condition) ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                          asset.condition === 'Fair' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        )}
                      >
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                        <SelectItem value="Under Repair">Under Repair</SelectItem>
                        <SelectItem value="Faulty">Faulty</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={asset.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => router.push(`/dashboard/assets/${asset.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSelectedAssetForQr(asset)}>
                          <QrCode className="mr-2 h-4 w-4" />
                          View QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAssetForQr} onOpenChange={(isOpen) => !isOpen && setSelectedAssetForQr(null)}>
        <DialogContent className="printable-area">
          <DialogHeader>
            <DialogTitle>QR Code for: {selectedAssetForQr?.itemName}</DialogTitle>
            <DialogDescription>
              Asset ID: {selectedAssetForQr?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedAssetForQr && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/dashboard/assets/verify/${selectedAssetForQr.id}`)}`}
                alt={`QR code for ${selectedAssetForQr.itemName}`}
                width={250}
                height={250}
                data-ai-hint="QR code"
              />
            )}
          </div>
          <DialogFooter className="no-print">
              <Button variant="outline" onClick={() => setSelectedAssetForQr(null)}>Close</Button>
              <Button onClick={handlePrint}>Print QR Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Scan Equipment QR Code</DialogTitle>
                <DialogDescription>
                    Use your camera to scan an equipment QR code, or enter the ID manually.
                </DialogDescription>
            </DialogHeader>
            {isScannerOpen && (
              <QrScanner 
                  onScanSuccess={handleScanSuccess}
                  onClose={() => setIsScannerOpen(false)}
              />
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
