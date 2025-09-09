'use server';

import { suggestOutsourcingOptions } from '@/ai/flows/suggest-outsourcing-options';
import type { SuggestOutsourcingOptionsInput } from '@/ai/flows/suggest-outsourcing-options';
import { USERS } from '@/lib/mock-data';
import type { User } from '@/types';

export async function handleSuggestOutsourcing(input: SuggestOutsourcingOptionsInput) {
  try {
    const result = await suggestOutsourcingOptions(input);
    return result;
  } catch (error) {
    console.error(error);
    return { suggestions: [] };
  }
}

export async function handleLogin(credentials: {username: string, password: string}): Promise<{success: boolean, user?: User, error?: string}> {
  const user = USERS.find(u => u.username === credentials.username && u.password === credentials.password);
  if (user) {
    // In a real app, you'd create a session here.
    // For this prototype, we'll just return success.
    return { success: true, user: { id: user.id, username: user.username, role: user.role } };
  }
  return { success: false, error: 'Invalid credentials' };
}
