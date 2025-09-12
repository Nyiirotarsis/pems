
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a one-time password (OTP).
 *
 * - generateAndSendOtp - A function that generates a 6-digit OTP.
 * - GenerateOtpInput - The input type for the OTP generation function.
 * - GenerateOtpOutput - The return type for the OTP generation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateOtpInputSchema = z.object({
  email: z.string().email().describe('The email address to send the OTP to.'),
});
export type GenerateOtpInput = z.infer<typeof GenerateOtpInputSchema>;

export const GenerateOtpOutputSchema = z.object({
  code: z.string().length(6).describe('The 6-digit OTP code.'),
});
export type GenerateOtpOutput = z.infer<typeof GenerateOtpOutputSchema>;

// This is a simple function that simulates generating and sending an OTP.
// In a real application, you would integrate an email service here.
export async function generateAndSendOtp(input: GenerateOtpInput): Promise<GenerateOtpOutput> {
  return generateAndSendOtpFlow(input);
}

const generateAndSendOtpFlow = ai.defineFlow(
  {
    name: 'generateAndSendOtpFlow',
    inputSchema: GenerateOtpInputSchema,
    outputSchema: GenerateOtpOutputSchema,
  },
  async (input) => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`Generated OTP for ${input.email}: ${code}`);
    
    // In a real application, you would:
    // 1. Save the code and its expiry time to a database, associated with the user's email.
    // 2. Use an email service (like SendGrid, Mailgun, etc.) to send the code to the user.
    // For this prototype, we'll just log it to the console and return it.

    return { code };
  }
);
