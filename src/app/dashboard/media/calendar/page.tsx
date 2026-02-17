"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, PlusCircle, MoreVertical, Edit, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import PEMSDashboard from "@/components/pems-dashboard";
import { useToast } from "@/hooks/use-toast";
import { scheduledPostSchema } from "@/lib/schemas";
import { mockScheduledPosts } from "@/lib/mock-data";
import type { ScheduledPost } from "@/types";
import { cn } from "@/lib/utils";

type PostStatus = "Draft" | "Scheduled" | "Published";

const statusColors: Record<PostStatus, string> = {
  Draft: "bg-gray-100 text-gray-800",
  Scheduled: "bg-blue-100 text-blue-800",
  Published: "bg-green-100 text-green-800",
};

export default function ContentCalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [posts, setPosts] = React.useState<ScheduledPost[]>(mockScheduledPosts);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof scheduledPostSchema>>({
    resolver: zodResolver(scheduledPostSchema),
    defaultValues: {
      scheduledDate: new Date(),
      scheduledTime: format(new Date(), "HH:mm"),
    },
  });

  const onSubmit = (values: z.infer<typeof scheduledPostSchema>) => {
    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      platform: values.platform,
      content: values.content,
      scheduledDate: new Date(
        `${format(values.scheduledDate, "yyyy-MM-dd")}T${values.scheduledTime}`
      ).toISOString(),
      status: "Scheduled",
    };
    setPosts(prev => [newPost, ...prev]);
    toast({
      title: "Post Scheduled",
      description: `Your post for ${values.platform} has been scheduled.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };
  
  const handleDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast({
        variant: "destructive",
        title: "Post Deleted",
        description: "The scheduled post has been removed.",
    });
  }

  const selectedDayPosts = posts.filter(post =>
    format(new Date(post.scheduledDate), "yyyy-MM-dd") === format(date || new Date(), "yyyy-MM-dd")
  );

  return (
    <PEMSDashboard initialRole="Media and Communication Officer">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <CardTitle className="font-headline text-2xl">
                    Content Calendar
                    </CardTitle>
                    <CardDescription>
                    Plan and visualize your content schedule across all platforms.
                    </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2" />
                            Schedule Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Schedule New Post</DialogTitle>
                            <DialogDescription>Fill in the details to schedule a new social media post.</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="platform"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Platform</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                                    <SelectItem value="X">X (Twitter)</SelectItem>
                                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                                    <SelectItem value="TikTok">TikTok</SelectItem>
                                                    <SelectItem value="YouTube">YouTube</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl><Textarea placeholder="What's on your mind?" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                     <FormField
                                        control={form.control}
                                        name="scheduledDate"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="scheduledTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time</FormLabel>
                                                <FormControl><Input type="time" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Schedule</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center">
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                />
            </div>
            <div className="md:col-span-1">
                <h3 className="text-lg font-semibold mb-4">
                    Posts for {format(date || new Date(), 'PPP')}
                </h3>
                {selectedDayPosts.length > 0 ? (
                    <div className="space-y-4">
                        {selectedDayPosts.map(post => (
                             <Card key={post.id}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm">{post.content}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                            <Badge className={cn(statusColors[post.status])}>{post.status}</Badge>
                                            <span>•</span>
                                            <span>{post.platform}</span>
                                            <span>•</span>
                                            <Clock className="h-3 w-3" />
                                            <span>{format(new Date(post.scheduledDate), 'p')}</span>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-red-500 focus:text-red-500">
                                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                        <p>No posts scheduled for this day.</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PEMSDashboard>
  );
}
