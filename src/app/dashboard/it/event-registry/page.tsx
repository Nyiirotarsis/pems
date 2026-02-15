
"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical, Edit, Trash2, Eye, FileText, Users, HardDrive, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PEMSDashboard from "@/components/pems-dashboard";
import { mockEventRegistry } from "@/lib/mock-data";
import type { EventRegistry } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventRegistrySchema } from "@/lib/schemas";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


function EventRegistryForm({ event, onSave, onFinished }: { event?: EventRegistry | null, onSave: (data: any) => void, onFinished: () => void }) {
    const form = useForm<z.infer<typeof eventRegistrySchema>>({
        resolver: zodResolver(eventRegistrySchema),
        defaultValues: event ? {
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            national: event.national || undefined,
            international: event.international || undefined,
            volumeRecorded: event.volumeRecorded || undefined,
            youtubeLink: event.youtubeLink || '',
            websiteLink: event.websiteLink || '',
            xLink: event.xLink || '',
            tiktokLink: event.tiktokLink || '',
            instagramLink: event.instagramLink || '',
            linkedinLink: event.linkedinLink || '',
            photoLink: event.photoLink || '',
            videoLink: event.videoLink || '',
        } : {
            status: "Planned",
            startDate: new Date(),
            endDate: new Date(),
            startTime: "09:00",
            endTime: "17:00"
        }
    });

    const { toast } = useToast();
    
    const watchedNational = form.watch("national");
    const watchedInternational = form.watch("international");

    React.useEffect(() => {
        const total = (watchedNational || 0) + (watchedInternational || 0);
        form.setValue("totalParticipants", total);
    }, [watchedNational, watchedInternational, form]);

    const handleSubmit = (data: z.infer<typeof eventRegistrySchema>) => {
        onSave(data);
        toast({ title: "Success", description: `Event "${data.eventDescription}" has been saved.` });
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <ScrollArea className="h-[70vh] pr-4">
                    <div className="space-y-6 p-1">
                        {/* Group 1: Basic Info */}
                        <Card>
                            <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="sn" render={({ field }) => (<FormItem><FormLabel>Serial Number (SN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="eventDescription" render={({ field }) => (<FormItem><FormLabel>Theme / Topic / Event Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="client" render={({ field }) => (<FormItem><FormLabel>Client</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </CardContent>
                        </Card>
                        
                        {/* Group 2: Dates and Times */}
                        <Card>
                            <CardHeader><CardTitle>Date & Time</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="startDate" render={({ field }) => (
                                    <FormItem><FormLabel>Start Date</FormLabel>
                                    <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                                    <FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="startTime" render={({ field }) => (<FormItem><FormLabel>Start Time (HH:MM)</FormLabel><FormControl><Input {...field} placeholder="09:00" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="endDate" render={({ field }) => (
                                    <FormItem><FormLabel>End Date</FormLabel>
                                    <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                                    <FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="endTime" render={({ field }) => (<FormItem><FormLabel>End Time (HH:MM)</FormLabel><FormControl><Input {...field} placeholder="17:00" /></FormControl><FormMessage /></FormItem>)} />
                            </CardContent>
                        </Card>

                        {/* Group 3: Participants */}
                        <Card>
                             <CardHeader><CardTitle>Client & Attendance Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="participants" render={({ field }) => (<FormItem><FormLabel>Participant Groups</FormLabel><FormControl><Input placeholder="e.g., Shareholders, Media" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="national" render={({ field }) => (<FormItem><FormLabel>National</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="international" render={({ field }) => (<FormItem><FormLabel>International</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="totalParticipants" render={({ field }) => (<FormItem><FormLabel>Total Participants</FormLabel><FormControl><Input type="number" {...field} readOnly /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Group 4: Technical Details */}
                         <Card>
                            <CardHeader><CardTitle>Activities & Technology</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="activities" render={({ field }) => (<FormItem><FormLabel>Activities Covered</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="technologyUsed" render={({ field }) => (<FormItem><FormLabel>Technology Used</FormLabel><FormControl><Textarea placeholder="Zoom, Slido, Livestream Kit, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="volumeRecorded" render={({ field }) => (<FormItem><FormLabel>Volume Recorded (GB)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="deliveredDescription" render={({ field }) => (<FormItem><FormLabel>Deliverables Description</FormLabel><FormControl><Textarea placeholder="Describe what was delivered to the client" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </CardContent>
                        </Card>
                        
                        {/* Group 5: Review */}
                         <Card>
                            <CardHeader><CardTitle>Post-Event Review</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="challenges" render={({ field }) => (<FormItem><FormLabel>Challenges Encountered</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="achievements" render={({ field }) => (<FormItem><FormLabel>Achievements</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                                 <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem><FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                        <SelectItem value="Planned">Planned</SelectItem>
                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                        <SelectItem value="Archived">Archived</SelectItem>
                                    </SelectContent></Select><FormMessage /></FormItem>)} />
                            </CardContent>
                        </Card>
                        
                        {/* Group 6: Links */}
                        <Card>
                            <CardHeader><CardTitle>Media & Social Links</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="youtubeLink" render={({ field }) => (<FormItem><FormLabel>YouTube Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="websiteLink" render={({ field }) => (<FormItem><FormLabel>Website/Blog Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="xLink" render={({ field }) => (<FormItem><FormLabel>X (Twitter) Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="tiktokLink" render={({ field }) => (<FormItem><FormLabel>TikTok Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="instagramLink" render={({ field }) => (<FormItem><FormLabel>Instagram Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="linkedinLink" render={({ field }) => (<FormItem><FormLabel>LinkedIn Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="photoLink" render={({ field }) => (<FormItem><FormLabel>Attached Photo Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="videoLink" render={({ field }) => (<FormItem><FormLabel>Attached Video Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="whatsapp" render={({ field }) => (<FormItem><FormLabel>WhatsApp Contact/Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4">
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">Save Event</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

export default function EventRegistryPage() {
    const [events, setEvents] = React.useState<EventRegistry[]>(mockEventRegistry);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState<EventRegistry | null>(null);
    const { toast } = useToast();
    
    const summaryStats = React.useMemo(() => {
        const totalEvents = events.length;
        const completedEvents = events.filter(e => e.status === 'Completed' || e.status === 'Delivered' || e.status === 'Archived').length;
        const totalParticipants = events.reduce((acc, e) => acc + (e.totalParticipants || 0), 0);
        const totalVolume = events.reduce((acc, e) => acc + (e.volumeRecorded || 0), 0);
        
        return { totalEvents, completedEvents, totalParticipants, totalVolume };
    }, [events]);

    const handleSave = (data: z.infer<typeof eventRegistrySchema>) => {
        const eventData = {
            ...data,
            startDate: format(data.startDate, "yyyy-MM-dd"),
            endDate: format(data.endDate, "yyyy-MM-dd"),
            totalParticipants: (data.national || 0) + (data.international || 0),
        };

        if (selectedEvent) {
            setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...eventData } as EventRegistry : e));
        } else {
            const newEvent: EventRegistry = {
                id: `EVT-00${events.length + 1}`,
                ...(eventData as any)
            };
            setEvents(prev => [newEvent, ...prev]);
        }
    };
    
    const handleDelete = (eventId: string) => {
        setEvents(events.filter(e => e.id !== eventId));
        toast({
            variant: "destructive",
            title: "Event Deleted",
            description: "The event record has been permanently deleted.",
        });
    }
    
    const statusColors: Record<string, string> = {
        Planned: "bg-gray-100 text-gray-800",
        Ongoing: "bg-blue-100 text-blue-800",
        Completed: "bg-green-100 text-green-800",
        Delivered: "bg-purple-100 text-purple-800",
        Archived: "bg-zinc-100 text-zinc-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    return (
        <PEMSDashboard initialRole="IT Managers">
             <Dialog open={isFormOpen} onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) setSelectedEvent(null);
            }}>
                <div className="space-y-6">
                    <div>
                        <h1 className="font-headline text-3xl font-semibold">Event Registry</h1>
                        <p className="text-muted-foreground">Log, track, and review all technical and media details for executed events.</p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Events Recorded</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold">{summaryStats.totalEvents}</div></CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold">{summaryStats.completedEvents}</div></CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold">{summaryStats.totalParticipants.toLocaleString()}</div></CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Volume Recorded (GB)</CardTitle>
                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold">{summaryStats.totalVolume.toLocaleString()}</div></CardContent>
                        </Card>
                    </div>

                    {/* Main Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="font-headline text-2xl">Event Register</CardTitle>
                                    <CardDescription>A log of all recorded events.</CardDescription>
                                </div>
                                 <DialogTrigger asChild>
                                    <Button onClick={() => setSelectedEvent(null)}>
                                        <PlusCircle className="mr-2" /> Register Event
                                    </Button>
                                </DialogTrigger>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SN</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>Theme/Topic</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Participants</TableHead>
                                        <TableHead>Volume (GB)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {events.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell>{event.sn}</TableCell>
                                            <TableCell>{format(new Date(event.startDate), "dd MMM yyyy")}</TableCell>
                                            <TableCell className="font-medium max-w-xs truncate">{event.eventDescription}</TableCell>
                                            <TableCell>{event.client}</TableCell>
                                            <TableCell>{event.totalParticipants}</TableCell>
                                            <TableCell>{event.volumeRecorded}</TableCell>
                                            <TableCell><Badge className={cn(statusColors[event.status])}>{event.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onSelect={() => { setSelectedEvent(event); setIsFormOpen(true); }}>
                                                            <Eye className="mr-2 h-4 w-4" /> View / Edit
                                                        </DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>This will permanently delete the event record for "{event.eventDescription}".</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(event.id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
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
                 <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{selectedEvent ? "Edit" : "Register New"} Event</DialogTitle>
                        <DialogDescription>
                            {selectedEvent ? `Editing details for event SN: ${selectedEvent.sn}` : "Fill in the form to log a new event."}
                        </DialogDescription>
                    </DialogHeader>
                    <EventRegistryForm event={selectedEvent} onSave={handleSave} onFinished={() => setIsFormOpen(false)} />
                </DialogContent>
            </Dialog>
        </PEMSDashboard>
    )
}
