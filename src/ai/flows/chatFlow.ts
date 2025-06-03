
'use server';
/**
 * @fileOverview A basic chat flow for CompassIA.
 *
 * - simpleChat - A function that handles a simple chat interaction.
 * - SimpleChatInput - The input type for the simpleChat function.
 * - SimpleChatOutput - The return type for the simpleChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit'; // Corrected import for Zod from Genkit

const SimpleChatInputSchema = z.object({
  query: z.string().describe('The user\'s question or message.'),
  userName: z.string().describe("The user's full display name.").optional(),
});
export type SimpleChatInput = z.infer<typeof SimpleChatInputSchema>;

const SimpleChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s query.'),
});
export type SimpleChatOutput = z.infer<typeof SimpleChatOutputSchema>;

// Define the prompt for the LLM
const chatPrompt = ai.definePrompt({
  name: 'compassiaChatPrompt',
  input: { schema: SimpleChatInputSchema },
  output: { schema: SimpleChatOutputSchema },
  prompt: `You are CompassIA, a helpful and professional assistant for MaarifCompass.org.
{{#if userName}}
You are speaking with {{userName}}. Address them in a professional and friendly manner, using their name when appropriate.
{{else}}
Address the user in a professional and friendly manner.
{{/if}}

The user's message is:
"{{{query}}}"

Please provide a concise and helpful response.
If the user asks for specific document information, politely state that you are currently a general assistant and will soon have access to specific documents.
  `,
});

// Define the Genkit flow
const simpleChatFlow = ai.defineFlow(
  {
    name: 'simpleChatFlow',
    inputSchema: SimpleChatInputSchema,
    outputSchema: SimpleChatOutputSchema,
  },
  async (input: SimpleChatInput) => {
    const llmResponse = await chatPrompt(input); // Call the prompt with the input
    const output = llmResponse.output; // Get the structured output

    if (!output) {
      return { response: "I'm sorry, I couldn't process that request." };
    }
    return { response: output.response };
  }
);

// Exported wrapper function to be called from the client
export async function simpleChat(input: SimpleChatInput): Promise<SimpleChatOutput> {
  const result = await simpleChatFlow(input);
  return result;
}

