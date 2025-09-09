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
      source: z.string().describe('The name of the vendor or source.'),
      equipment: z.string().describe('The name of the equipment.'),
      quantity: z.number().describe('The quantity to be sourced.'),
      cost: z.string().describe('The estimated cost for outsourcing from this source.'),
    })
  ).describe('A list of outsourcing suggestions.'),
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

  You must provide a list of 3 potential sources with estimated costs for the following item and quantity. The equipment name in the output should match the input item name, and the quantity should match the input quantity.

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
            "source": { "type": "string" },
            "equipment": { "type": "string" },
            "quantity": { "type": "number" },
            "cost": { "type": "string" }
          },
          "required": ["source", "equipment", "quantity", "cost"]
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
