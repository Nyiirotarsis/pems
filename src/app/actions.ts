'use server';

import { suggestOutsourcingOptions } from '@/ai/flows/suggest-outsourcing-options';
import type { SuggestOutsourcingOptionsInput } from '@/ai/flows/suggest-outsourcing-options';
import { USERS, mockInvoices } from '@/lib/mock-data';
import type { User, Invoice } from '@/types';

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
