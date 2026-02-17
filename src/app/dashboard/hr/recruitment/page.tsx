
"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, subWeeks } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  UserPlus,
  Users,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  PlusCircle,
  Eye
} from "lucide-react";

import PEMSDashboard from "@/components/pems-dashboard";
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
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";

import { jobOpeningFormSchema } from "@/lib/schemas";
import { mockJobOpenings, mockApplicants } from "@/lib/mock-data";
import type { JobOpening, Applicant, ApplicantStatus } from "@/types";

type JobOpeningFormValues = z.infer<typeof jobOpeningFormSchema>;

function JobOpeningForm({ job, onSave, onFinished }: { job?: JobOpening | null, onSave: (data: JobOpeningFormValues, jobId?: string) => void, onFinished: () => void }) {
    const form = useForm<JobOpeningFormValues>({
        resolver: zodResolver(jobOpeningFormSchema),
        defaultValues: job ? {
            ...job,
        } : {
            title: "",
            department: "",
            status: "Open",
            description: ""
        }
    });
    
    const handleSubmit = (data: JobOpeningFormValues) => {
        onSave(data, job?.id);
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl><Input placeholder="e.g., Senior Sound Engineer" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Operations">Operations</SelectItem>
                                <SelectItem value="Human Resources">Human Resources</SelectItem>
                                <SelectItem value="Media">Media</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe the role and responsibilities..." {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
                    <Button type="submit">Save Job</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

const applicantStatusColors: Record<ApplicantStatus, string> = {
    Applied: "bg-gray-100 text-gray-800",
    Screening: "bg-blue-100 text-blue-800",
    Interview: "bg-purple-100 text-purple-800",
    Offer: "bg-yellow-100 text-yellow-800",
    Hired: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
};

export default function RecruitmentPage() {
    const [jobOpenings, setJobOpenings] = React.useState<JobOpening[]>(mockJobOpenings);
    const [applicants, setApplicants] = React.useState<Applicant[]>(mockApplicants);

    const [isJobFormOpen, setIsJobFormOpen] = React.useState(false);
    const [isApplicantsViewOpen, setIsApplicantsViewOpen] = React.useState(false);
    const [selectedJob, setSelectedJob] = React.useState<JobOpening | null>(null);

    const { toast } = useToast();

    const summaryStats = React.useMemo(() => {
        const openPositions = jobOpenings.filter(j => j.status === 'Open').length;
        const totalApplicants = applicants.length;
        const oneWeekAgo = subWeeks(new Date(), 1);
        const newApplicants = applicants.filter(a => new Date(a.appliedDate) > oneWeekAgo).length;
        return { openPositions, totalApplicants, newApplicants };
    }, [jobOpenings, applicants]);

    const handleSaveJob = (data: JobOpeningFormValues, jobId?: string) => {
        if (jobId) {
            setJobOpenings(prev => prev.map(j => j.id === jobId ? { ...j, ...data } : j));
            toast({ title: 'Job Updated', description: `The job "${data.title}" has been updated.` });
        } else {
            const newJob: JobOpening = {
                id: `JOB-${Date.now().toString().slice(-4)}`,
                ...data,
                postedDate: format(new Date(), 'yyyy-MM-dd'),
                applicants: [],
            };
            setJobOpenings(prev => [newJob, ...prev]);
            toast({ title: 'Job Posted', description: `The new job "${data.title}" has been posted.` });
        }
    };
    
    const handleUpdateApplicantStatus = (applicantId: number, status: ApplicantStatus) => {
        setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status } : a));
        toast({ title: "Applicant Status Updated", description: "The applicant's status has been changed."});
    };

    const openApplicantsView = (job: JobOpening) => {
        setSelectedJob(job);
        setIsApplicantsViewOpen(true);
    };

    return (
        <PEMSDashboard initialRole="HR/Admin">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <Button asChild variant="outline" size="icon">
                                    <Link href="/dashboard/hr"><ArrowLeft className="h-4 w-4" /></Link>
                                </Button>
                                <div>
                                    <CardTitle className="font-headline text-2xl">Recruitment</CardTitle>
                                    <CardDescription>Manage job openings and track applicants.</CardDescription>
                                </div>
                            </div>
                            <Button onClick={() => { setSelectedJob(null); setIsJobFormOpen(true); }}>
                                <PlusCircle className="mr-2" /> Post New Job
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Open Positions</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.openPositions}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Applicants</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.totalApplicants}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">New Applicants (Last 7 Days)</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.newApplicants}</div></CardContent></Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Job Openings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Applicants</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Posted On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobOpenings.map(job => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">{job.title}</TableCell>
                                        <TableCell>{job.department}</TableCell>
                                        <TableCell>{job.applicants.length}</TableCell>
                                        <TableCell><Badge variant={job.status === 'Open' ? 'default' : 'secondary'}>{job.status}</Badge></TableCell>
                                        <TableCell>{format(new Date(job.postedDate), 'PPP')}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => openApplicantsView(job)}><Eye className="mr-2 h-4 w-4" />View Applicants</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => { setSelectedJob(job); setIsJobFormOpen(true); }}><Edit className="mr-2 h-4 w-4" />Edit Job</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-500 focus:text-red-500"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
            
             <Dialog open={isJobFormOpen} onOpenChange={(open) => { if (!open) setSelectedJob(null); setIsJobFormOpen(open); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedJob ? 'Edit' : 'Post New'} Job</DialogTitle>
                        <DialogDescription>
                            {selectedJob ? `Editing the job opening for "${selectedJob.title}"` : "Fill in the details for the new job opening."}
                        </DialogDescription>
                    </DialogHeader>
                    <JobOpeningForm job={selectedJob} onSave={handleSaveJob} onFinished={() => setIsJobFormOpen(false)} />
                </DialogContent>
            </Dialog>
            
            <Dialog open={isApplicantsViewOpen} onOpenChange={setIsApplicantsViewOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Applicants for: {selectedJob?.title}</DialogTitle>
                        <DialogDescription>Manage candidates for this role.</DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Applied On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedJob?.applicants.map(applicant => (
                                <TableRow key={applicant.id}>
                                    <TableCell>
                                        <div className="font-medium">{applicant.name}</div>
                                        <div className="text-sm text-muted-foreground">{applicant.email}</div>
                                    </TableCell>
                                    <TableCell>{format(new Date(applicant.appliedDate), 'PPP')}</TableCell>
                                    <TableCell><Badge className={applicantStatusColors[applicant.status]}>{applicant.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4"/>View Resume</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {(Object.keys(applicantStatusColors) as ApplicantStatus[]).map(status => (
                                                    <DropdownMenuItem key={status} onSelect={() => handleUpdateApplicantStatus(applicant.id, status)}>
                                                        Mark as {status}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>

        </PEMSDashboard>
    );
}
