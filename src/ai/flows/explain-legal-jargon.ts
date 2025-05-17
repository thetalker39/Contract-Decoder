// src/ai/flows/explain-legal-jargon.ts
'use server';

/**
 * @fileOverview Explains legal jargon in a contract based on a selected level of complexity.
 *
 * - explainLegalJargon - A function that handles the explanation of legal jargon.
 * - ExplainLegalJargonInput - The input type for the explainLegalJargon function.
 * - ExplainLegalJargonOutput - The return type for the explainLegalJargon function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLegalJargonInputSchema = z.object({
  contractText: z.string().describe('The contract text to explain.'),
  explanationLevel: z
    .enum(['beginner', 'intermediate', 'professional'])
    .describe('The level of explanation complexity.'),
});
export type ExplainLegalJargonInput = z.infer<typeof ExplainLegalJargonInputSchema>;

const ExplainLegalJargonOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the legal jargon.'),
});
export type ExplainLegalJargonOutput = z.infer<typeof ExplainLegalJargonOutputSchema>;

export async function explainLegalJargon(
  input: ExplainLegalJargonInput
): Promise<ExplainLegalJargonOutput> {
  return explainLegalJargonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLegalJargonPrompt',
  input: {schema: ExplainLegalJargonInputSchema},
  output: {schema: ExplainLegalJargonOutputSchema},
  prompt: `You are a legal expert who can explain legal jargon in simple terms.

  Explain the following contract text at the {{{explanationLevel}}} level:

  {{{contractText}}}`,
});

const explainLegalJargonFlow = ai.defineFlow(
  {
    name: 'explainLegalJargonFlow',
    inputSchema: ExplainLegalJargonInputSchema,
    outputSchema: ExplainLegalJargonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
