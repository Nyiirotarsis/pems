'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting outsourcing options when an item is unavailable in the inventory.
 *
 * - suggestOutsourcingOptions - A function that suggests outsourcing options with budgetary estimates.
 * - SuggestOutsourcingOptionsInput - The input type for the suggestOutsourcingOptions function.
 * - SuggestOutsourcingOptionsOutput - The return type for the suggestOutsourcingOptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOutsourcingOptionsInputSchema = z.object({
  item: z.string().describe('The name of the item to outsource.'),
  quantity: z.number().describe('The quantity of the item needed.'),
});
export type SuggestOutsourcingOptionsInput = z.infer<typeof SuggestOutsourcingOptionsInputSchema>;

const SuggestOutsourcingOptionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      vendor: z.string().describe('The name of the vendor.'),
      estimate: z.string().describe('The budgetary estimate for outsourcing from this vendor.'),
      contact: z.string().describe('The contact information for the vendor.'),
    })
  ).describe('A list of outsourcing suggestions with budgetary estimates.'),
});
export type SuggestOutsourcingOptionsOutput = z.infer<typeof SuggestOutsourcingOptionsOutputSchema>;

export async function suggestOutsourcingOptions(input: SuggestOutsourcingOptionsInput): Promise<SuggestOutsourcingOptionsOutput> {
  return suggestOutsourcingOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOutsourcingOptionsPrompt',
  input: {schema: SuggestOutsourcingOptionsInputSchema},
  output: {schema: SuggestOutsourcingOptionsOutputSchema},
  prompt: `You are a helpful assistant that suggests outsourcing options for equipment when it is not available in the inventory.

  Provide a list of potential vendors, budgetary estimates, and contact information for the following item and quantity:

  Item: {{item}}
  Quantity: {{quantity}}

  Format your response as a JSON array of objects with vendor, estimate, and contact fields.
  `,
});

const suggestOutsourcingOptionsFlow = ai.defineFlow(
  {
    name: 'suggestOutsourcingOptionsFlow',
    inputSchema: SuggestOutsourcingOptionsInputSchema,
    outputSchema: SuggestOutsourcingOptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
