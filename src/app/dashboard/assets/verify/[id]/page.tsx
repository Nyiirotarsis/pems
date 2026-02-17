"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initialInventory } from "@/lib/mock-data";
import { InventoryItem } from "@/types";
import { format } from "date-fns";

export default function VerifyAssetPage() {
  const params = useParams<{ id: string }>();
  const [asset, setAsset] = React.useState<InventoryItem | null>(null);

  React.useEffect(() => {
    if (params.id) {
      const foundAsset = initialInventory.find(a => a.id === params.id);
      setAsset(foundAsset || null);
    }
  }, [params.id]);

  if (!asset) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Asset Not Found</CardTitle>
                    <CardDescription>The asset ID "{params.id}" does not match any records in our inventory.</CardDescription>
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
           <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="icon">
                <Link href="/dashboard/assets"><ArrowLeft className="h-4 w-4" /></Link>
              </Button>
              <div>
                <CardTitle className="font-headline text-2xl">
                  Asset Verification
                </CardTitle>
                <CardDescription>
                  Details for asset ID: <span className="font-mono">{params.id}</span>
                </CardDescription>
              </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                 {asset.imageURL ? (
                    <Image 
                        src={asset.imageURL}
                        alt={asset.itemName}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover border"
                    />
                 ) : (
                    <div className="w-[150px] h-[150px] flex items-center justify-center bg-muted rounded-lg border">
                        <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                 )}
                 <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm flex-1">
                    <div className="font-semibold text-muted-foreground">Item Name</div>
                    <div className="font-medium">{asset.itemName}</div>

                    <div className="font-semibold text-muted-foreground">Category</div>
                    <div>{asset.category}</div>
                    
                    <div className="font-semibold text-muted-foreground">Location</div>
                    <div>{asset.location}</div>
                    
                    <div className="font-semibold text-muted-foreground">Condition</div>
                    <div><Badge variant={asset.condition === 'Good' || asset.condition === 'New' ? 'default' : 'destructive'}>{asset.condition}</Badge></div>

                    <div className="font-semibold text-muted-foreground">Status</div>
                    <div><Badge variant={asset.status === 'Available' ? 'default' : 'secondary'}>{asset.status}</Badge></div>

                    <div className="font-semibold text-muted-foreground">Purchase Date</div>
                    <div>{format(new Date(asset.datePurchased), "PPP")}</div>
                 </div>
            </div>
            {asset.issuedTo && (
                 <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                        <p className="font-semibold">Currently Issued To: {asset.issuedTo} for event/venue: {asset.venue}</p>
                        <p className="text-sm text-muted-foreground">Date Issued: {asset.dateIssued ? format(new Date(asset.dateIssued), "PPP") : 'N/A'}</p>
                    </CardContent>
                 </Card>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
