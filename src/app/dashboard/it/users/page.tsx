
"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { userFormSchema } from "@/lib/schemas";
import { USERS, ROLES } from "@/lib/mock-data";
import { User, UserRole } from "@/types";
import { addUser, updateUser, deleteUser } from "@/app/actions";

type UserFormValues = z.infer<typeof userFormSchema>;

function UserForm({ user, onSave, onFinished }: { user?: User | null, onSave: (data: UserFormValues, userId?: number) => Promise<any>, onFinished: () => void }) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ? { 
        email: user.username,
        role: user.role,
        password: '',
        confirmPassword: '',
    } : {
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    },
  });

  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (data: UserFormValues) => {
    startTransition(async () => {
      const result = await onSave(data, user?.id);
      if (result.success) {
        toast({
          title: user ? "User Updated" : "User Added",
          description: `User ${data.email} has been successfully ${user ? 'updated' : 'added'}.`,
        });
        onFinished();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "An unexpected error occurred.",
        });
      }
    });
  };

  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email / Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g., user@pacificevents.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{user ? "New Password (optional)" : "Password"}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <DialogFooter>
            <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save User"}
            </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}


export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = React.useState<User[]>(USERS);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    
    const handleSaveUser = async (data: UserFormValues, userId?: number) => {
        if (userId) { // Editing existing user
            const result = await updateUser(userId, data);
            if (result.success && result.user) {
                setUsers(users.map(u => u.id === userId ? result.user! : u));
            }
            return result;
        } else { // Adding new user
             const result = await addUser(data);
            if (result.success && result.user) {
                setUsers([...users, result.user]);
            }
            return result;
        }
    }
    
    const handleDeleteUser = async (userId: number) => {
        const result = await deleteUser(userId);
        if (result.success) {
            setUsers(users.filter(u => u.id !== userId));
            toast({
                title: "User Deleted",
                description: `The user has been successfully removed.`,
            });
        } else {
             toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Could not delete user.",
            });
        }
    }


  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/dashboard/it">
                        <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <CardTitle className="font-headline text-2xl">User Management</CardTitle>
                        <CardDescription>
                        Create new users, assign roles, and manage permissions.
                        </CardDescription>
                    </div>
                    </div>
                    <DialogTrigger asChild>
                        <Button onClick={() => setSelectedUser(null)}>
                            <UserPlus className="mr-2" /> Add User
                        </Button>
                    </DialogTrigger>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => {
                                                setSelectedUser(user);
                                                setIsFormOpen(true);
                                            }}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
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
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the user account for {user.username}.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Continue</AlertDialogAction>
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
        
         <DialogContent>
            <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
                {selectedUser ? `Editing details for ${selectedUser.username}.` : "Fill in the form to create a new user account."}
            </DialogDescription>
            </DialogHeader>
            <UserForm user={selectedUser} onSave={handleSaveUser} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
    </Dialog>
  );
}
