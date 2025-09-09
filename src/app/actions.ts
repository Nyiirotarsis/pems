'use server';

import { suggestOutsourcingOptions } from '@/ai/flows/suggest-outsourcing-options';
import type { SuggestOutsourcingOptionsInput } from '@/ai/flows/suggest-outsourcing-options';

export async function handleSuggestOutsourcing(input: SuggestOutsourcingOptionsInput) {
  try {
    const result = await suggestOutsourcingOptions(input);
    return result;
  } catch (error) {
    console.error(error);
    return { suggestions: [] };
  }
}
