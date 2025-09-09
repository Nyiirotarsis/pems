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

  You must provide a list of 3 potential vendors, budgetary estimates, and contact information for the following item and quantity.

  Item: {{item}}
  Quantity: {{quantity}}

  You must format your response as a valid JSON object that conforms to the following Zod schema. Do not include any other text or formatting.
  Your output must be a single JSON object that can be parsed by JSON.parse.

  Schema:
  \`\`\`json
  {
    "type": "object",
    "properties": {
      "suggestions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "vendor": { "type": "string" },
            "estimate": { "type": "string" },
            "contact": { "type": "string" }
          },
          "required": ["vendor", "estimate", "contact"]
        }
      }
    },
    "required": ["suggestions"]
  }
  \`\`\`
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
    if (!output) {
      return {suggestions: []};
    }
    return output;
  }
);
