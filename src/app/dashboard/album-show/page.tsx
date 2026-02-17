
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    MoreVertical,
    QrCode,
    Eye,
    Edit,
    Trash2,
    BarChart,
    PlusCircle
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PEMSDashboard from "@/components/pems-dashboard";
import { mockAlbums } from "@/lib/mock-data";
import type { Album } from "@/types";
import { format } from "date-fns";

export default function AlbumShowPage() {
    const [albums] = useState<Album[]>(mockAlbums);
    const [selectedAlbumForQr, setSelectedAlbumForQr] = useState<Album | null>(null);

    const chartData = useMemo(() => {
        return albums
            .sort((a, b) => b.views - a.views)
            .slice(0, 5) // Top 5
            .map(album => ({
                name: album.title,
                views: album.views
            }));
    }, [albums]);
    
    const handlePrint = () => {
      window.print();
    }

  return (
    <PEMSDashboard initialRole="Media and Communication Officer">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                  <Link href="/dashboard/media">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <CardTitle className="font-headline text-2xl">
                    Digital Media Albums
                  </CardTitle>
                  <CardDescription>
                    Browse, manage, and share event photo albums.
                  </CardDescription>
                </div>
              </div>
              <Button>
                <PlusCircle className="mr-2" />
                Create New Album
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5"/>
                    Most Viewed Albums
                </CardTitle>
                <CardDescription>A look at the top 5 most popular albums based on views.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="h-[250px] w-full">
                    <ResponsiveContainer>
                        <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 120 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                            <XAxis type="number" dataKey="views" />
                            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} interval={0} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="views" fill="hsl(var(--chart-1))" radius={4} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={album.coverImageUrl}
                  alt={`Cover for ${album.title}`}
                  width={600}
                  height={400}
                  className="rounded-t-lg aspect-video object-cover"
                  data-ai-hint="event photography"
                />
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-lg">{album.title}</h3>
                <p className="text-sm text-muted-foreground">{album.client}</p>
                 <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(album.date), "PPP")}
                </p>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                 <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{album.photoCount} photos</span>
                    <span>{album.views} views</span>
                 </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> View Album
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSelectedAlbumForQr(album)}>
                      <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
       <Dialog open={!!selectedAlbumForQr} onOpenChange={(isOpen) => !isOpen && setSelectedAlbumForQr(null)}>
        <DialogContent className="printable-area">
          <DialogHeader>
            <DialogTitle>QR Code for: {selectedAlbumForQr?.title}</DialogTitle>
            <DialogDescription>
              Album ID: {selectedAlbumForQr?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedAlbumForQr && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://example.com/albums/${selectedAlbumForQr.id}`)}`}
                alt={`QR code for ${selectedAlbumForQr.title}`}
                width={250}
                height={250}
                data-ai-hint="QR code"
              />
            )}
          </div>
          <DialogFooter className="no-print">
              <Button variant="outline" onClick={() => setSelectedAlbumForQr(null)}>Close</Button>
              <Button onClick={handlePrint}>Print QR Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PEMSDashboard>
  );
}
