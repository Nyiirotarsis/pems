
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  initialInventory,
  mockUsers,
  assetCategories,
} from "@/lib/mock-data";
import type { Asset, InventoryItem } from "@/types";

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
import { cn } from "@/lib/utils";

type AssetWithDetails = Asset & {
  assetName: string;
  category: string;
};

type StatusFilter = "All" | "Available" | "Issued" | "Faulty" | "Damaged";

const statusColors: Record<string, string> = {
  Available:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
  Issued:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
  Faulty:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700",
  Damaged:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700",
};

const statusIcons: Record<string, React.ElementType> = {
  Available: Package,
  Issued: User,
  Faulty: Wrench,
  Damaged: Wrench,
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
  const [assets, setAssets] = React.useState<AssetWithDetails[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("All");

  React.useEffect(() => {
    const allAssets = initialInventory.flatMap((item: InventoryItem) =>
      item.assets.map((asset) => ({
        ...asset,
        assetName: item.name,
        category: item.category,
      }))
    );
    setAssets(allAssets);
  }, []);

  const filteredAssets = assets.filter((asset) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Available" || statusFilter === "Issued") {
      return asset.status === statusFilter;
    }
    return asset.condition === statusFilter;
  });
  
  const getAssignedToName = (username?: string) => {
    if (!username) return <span className="text-muted-foreground">Store Room</span>;
    const user = mockUsers.find(u => u.username === username);
    return user ? user.role : username;
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
                  <SelectItem value="Faulty">Faulty</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <FileDown className="mr-2" />
                Export
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
                  <TableCell className="font-medium">{asset.assetName}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{getAssignedToName(asset.assignedTo)}</TableCell>
                  <TableCell>{asset.purchaseDate}</TableCell>
                  <TableCell>
                     <Badge variant={asset.condition === 'Good' ? 'default' : 'destructive'}>{asset.condition}</Badge>
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
    </div>
  );
}
