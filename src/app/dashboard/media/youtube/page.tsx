
"use client";

import React, { useMemo } from "react";
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
  Users,
  Eye,
  Video,
  Upload,
  Youtube as YoutubeIcon,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PEMSDashboard from "@/components/pems-dashboard";
import { mockYouTubeVideos } from "@/lib/mock-data";
import type { YouTubeVideo } from "@/types";
import { format } from "date-fns";

export default function YouTubeDashboardPage() {
  const chartData = useMemo(() => {
    return mockYouTubeVideos
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((video) => ({
        name: video.title,
        views: video.views,
      }));
  }, []);
  
  const totalViews = useMemo(() => mockYouTubeVideos.reduce((acc, video) => acc + video.views, 0), []);
  const totalSubscribers = 25000; // Mock data

  return (
    <PEMSDashboard initialRole="Media and Communication Officer">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <YoutubeIcon className="h-6 w-6 text-red-600" />
                  YouTube Channel Analytics
                </CardTitle>
                <CardDescription>
                  Monitor performance and manage your video content.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="https://studio.youtube.com/" target="_blank" rel="noopener noreferrer">
                    Go to YouTube Studio
                  </a>
                </Button>
                <Button asChild>
                    <a href="https://youtube.com/upload" target="_blank" rel="noopener noreferrer">
                        <Upload className="mr-2" /> Upload Video
                    </a>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{mockYouTubeVideos.length}</div>
                </CardContent>
            </Card>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Top 5 Most Viewed Videos</CardTitle>
            <CardDescription>
              A look at your channel's top-performing content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ left: 200, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" dataKey="views" tickFormatter={(val) => `${val / 1000}k`} />
                  <YAxis dataKey="name" type="category" width={200} tick={{ fontSize: 12 }} interval={0} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="views"
                    fill="hsl(var(--chart-1))"
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockYouTubeVideos.map((video) => (
            <Card key={video.id} className="flex flex-col">
              <CardContent className="p-0">
                <Link href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                    <Image
                    src={video.thumbnailUrl}
                    alt={`Thumbnail for ${video.title}`}
                    width={480}
                    height={270}
                    className="rounded-t-lg aspect-video object-cover"
                    data-ai-hint="event video production"
                    />
                </Link>
              </CardContent>
              <CardHeader className="p-4 flex-grow">
                <CardTitle className="text-base font-semibold leading-snug">
                    <Link href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {video.title}
                    </Link>
                </CardTitle>
              </CardHeader>
              <CardFooter className="p-4 flex justify-between text-sm text-muted-foreground">
                <span>{video.views.toLocaleString()} views</span>
                <span>{format(new Date(video.publishedDate), "PPP")}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PEMSDashboard>
  );
}
