
'use server';

import { suggestOutsourcingOptions } from '@/ai/flows/suggest-outsourcing-options';
import type { SuggestOutsourcingOptionsInput } from '@/ai/flows/suggest-outsourcing-options';
import { USERS, mockInvoices } from '@/lib/mock-data';
import type { User, Invoice, UserRole } from '@/types';

export async function handleLogin(data: {username: string; password: string}): Promise<{success: boolean; user?: Partial<User>; error?: string}> {
  try {
    const { username, password } = data;

    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
      const userToReturn: Partial<User> = { id: user.id, username: user.username, role: user.role };
      return { success: true, user: userToReturn };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    // In a real app, you'd want to log this error.
    return { success: false, error: 'An internal server error occurred' };
  }
}

export async function handleSuggestOutsourcing(input: SuggestOutsourcingOptionsInput) {
  try {
    const result = await suggestOutsourcingOptions(input);
    return result;
  } catch (error) {
    console.error(error);
    return { suggestions: [] };
  }
}

export async function handleSignup(data: {email: string; password: string, role: string}): Promise<{success: boolean; error?: string}> {
    const existingUser = USERS.find(u => u.username === data.email);

    if (existingUser) {
        return { success: false, error: 'User already exists' };
    }

    // In a real app, you'd save the new user to the database here.
    // For this prototype, we are not persisting the new user.
    console.log('New user would be created:', data);
    
    return { success: true };
}

export async function updateInvoiceStatus(invoiceNumber: string, payments: { amount: number }[]): Promise<{ success: boolean; invoice?: Invoice }> {
  const invoice = mockInvoices.find(inv => inv.number === invoiceNumber);
  if (!invoice) {
    return { success: false };
  }

  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  
  if (totalPaid >= invoice.amount) {
    invoice.status = "Paid";
  } else if (totalPaid > 0) {
    invoice.status = "Partially Paid";
  } else {
    invoice.status = "Unpaid";
  }

  // In a real app, this would save to a DB. Here we're mutating mock data.
  return { success: true, invoice };
}


// Mock User Management Actions
export async function addUser(data: { email: string; role: string; password?: string }): Promise<{success: boolean; user?: User; error?: string}> {
    if (USERS.find(u => u.username === data.email)) {
        return { success: false, error: "User with this email already exists." };
    }
    const newUser: User = {
        id: USERS.length + 1,
        username: data.email,
        role: data.role as UserRole,
        password: data.password || "123" // a mock password
    };
    console.log("Adding new user (mock):", newUser);
    // USERS.push(newUser); // In a real app, you would persist this. This is commented out to avoid build errors.
    return { success: true, user: newUser };
}

export async function updateUser(userId: number, data: { email: string; role: string; password?: string }): Promise<{success: boolean; user?: User; error?: string}> {
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: "User not found." };
    }
    const updatedUser: User = {
        ...USERS[userIndex],
        username: data.email,
        role: data.role as UserRole,
        // Only update password if a new one is provided
        password: data.password ? data.password : USERS[userIndex].password,
    };
    console.log("Updating user (mock):", updatedUser);
    // USERS[userIndex] = updatedUser; // In a real app, you would persist this. This is commented out to avoid build errors.
    return { success: true, user: updatedUser };
}

export async function deleteUser(userId: number): Promise<{success: boolean; error?: string}> {
    const userIndex = USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: "User not found." };
    }
    console.log("Deleting user (mock):", USERS[userIndex]);
    // USERS.splice(userIndex, 1); // In a real app, you would persist this. This is commented out to avoid build errors.
    return { success: true };
}
