
// src/ai/flows/compare-contract.ts
'use server';

/**
 * @fileOverview Analyzes a contract and provides a favorability rating, general advice, and recommendations.
 *
 * - compareContract - A function that analyzes the contract.
 * - CompareContractInput - The input type for the compareContract function.
 * - CompareContractOutput - The return type for the compareContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareContractInputSchema = z.object({
  contractText: z.string().describe('The text of the contract to analyze.'),
  industryStandardInfo: z
    .string()
    .optional()
    .describe('Industry standard information to compare the contract against, potentially specific to artists or producers.'),
});
export type CompareContractInput = z.infer<typeof CompareContractInputSchema>;

const CompareContractOutputSchema = z.object({
  favorabilityScore: z
    .number()
    .int()
    .min(1)
    .max(100)
    .describe('A score from 1-100 representing the favorability of the contract towards the user (artist or producer).'),
  generalAdvice: z.string().describe('General advice regarding the contract, tailored to whether the user is likely an artist or producer.'),
  recommendations: z.string().describe('Specific recommendations for the user (artist or producer) regarding the contract, including negotiation points like a producer advance of $2,500-$5,000 if applicable.'),
});
export type CompareContractOutput = z.infer<typeof CompareContractOutputSchema>;

export async function compareContract(
  input: CompareContractInput
): Promise<CompareContractOutput> {
  return compareContractFlow(input);
}

const compareContractPrompt = ai.definePrompt({
  name: 'compareContractPrompt',
  input: {schema: CompareContractInputSchema},
  output: {schema: CompareContractOutputSchema},
  prompt: `You are an AI expert in contract law.
Do not use markdown bolding (e.g., **text**) in your response. Present information clearly.

First, analyze the following contract text to determine if it primarily concerns an artist or a producer.
Then, determine its favorability towards that user.

Contract Text:
{{contractText}}

{{#if industryStandardInfo}}
Compare the contract against the following industry standard information, considering if the contract is for an artist or producer:
{{{industryStandardInfo}}}
{{/if}}

Provide a favorability score from 1-100 (1 being very unfavorable, 100 being very favorable).
Also, provide general advice and specific recommendations for the user, tailored to their likely role (artist or producer).
If the contract pertains to a producer and involves an advance or fee, a typical industry standard range to consider for negotiation is $2,500 - $5,000. Incorporate this into your recommendations if relevant.

Ensure that the output is well-formatted and easy to understand. Follow the output schema strictly.
`,
});

const compareContractFlow = ai.defineFlow(
  {
    name: 'compareContractFlow',
    inputSchema: CompareContractInputSchema,
    outputSchema: CompareContractOutputSchema,
  },
  async input => {
    const {output} = await compareContractPrompt(input);
    return output!;
  }
);
