
"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Edit, Save, Camera, User as UserIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";
import { USERS, ROLES } from "@/lib/mock-data";
import { User, UserRole } from "@/types";
import { profileFormSchema } from "@/lib/schemas";
import PEMSDashboard from "@/components/pems-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileForm({ user, onSave, onFinished }: { user: User, onSave: (data: ProfileFormValues) => void, onFinished: () => void }) {
    const [preview, setPreview] = React.useState<string | null>(null);
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name || user.username,
            email: user.username,
            password: '',
            confirmPassword: '',
        },
    });

    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const fileRef = form.register("avatar");

    const handleSubmit = (data: ProfileFormValues) => {
        onSave(data);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        onFinished();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                           <FormLabel htmlFor="avatar-upload" className="cursor-pointer">
                               <div className="relative group">
                                   <Avatar className="h-24 w-24">
                                        <AvatarImage src={preview || `https://i.pravatar.cc/150?u=${user.username}`} alt={user.name} />
                                        <AvatarFallback>{user.name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                                   </Avatar>
                                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                       <Camera className="h-8 w-8 text-white" />
                                   </div>
                               </div>
                           </FormLabel>
                            <FormControl>
                                <Input 
                                    id="avatar-upload"
                                    type="file" 
                                    className="hidden"
                                    accept="image/*"
                                    {...fileRef}
                                    onChange={(e) => {
                                        field.onChange(e.target.files);
                                        handleFileChange(e);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email / Username</FormLabel>
                            <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password (optional)</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button variant="ghost" type="button" onClick={onFinished}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}


export default function ProfilePage() {
    // In a real app, you'd fetch the current user's data
    const [user, setUser] = React.useState<User | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    React.useEffect(() => {
        const role = localStorage.getItem("userRole") as UserRole;
        if (role) {
            // Find a user that matches the role. This is a simplification.
            // In a real app, you'd have a user ID.
            const currentUser = USERS.find(u => u.role === role) || USERS[0];
            setUser(currentUser);
        }
    }, []);

    const handleSaveProfile = (data: ProfileFormValues) => {
        console.log("Saving profile", data);
        if (user) {
            setUser({ ...user, name: data.name, username: data.email });
        }
    };
    
    if (!user) {
        return (
             <PEMSDashboard initialRole={null}>
                <p>Loading user profile...</p>
             </PEMSDashboard>
        );
    }

  return (
    <PEMSDashboard initialRole={user.role}>
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-2xl">My Profile</CardTitle>
                            <CardDescription>
                                View and manage your personal information and settings.
                            </CardDescription>
                        </div>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Edit className="mr-2" /> Edit Profile
                            </Button>
                        </DialogTrigger>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${user.username}`} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold">{user.name || user.username}</h2>
                            <p className="text-muted-foreground">{user.role}</p>
                            <p className="text-sm text-muted-foreground">{user.username}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal details below.
                    </DialogDescription>
                </DialogHeader>
                <ProfileForm user={user} onSave={handleSaveProfile} onFinished={() => setIsFormOpen(false)} />
            </DialogContent>
        </Dialog>
    </PEMSDashboard>
  );
}
