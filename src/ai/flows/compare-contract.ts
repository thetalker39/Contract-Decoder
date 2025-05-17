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
    .describe('Industry standard information to compare the contract against.'),
});
export type CompareContractInput = z.infer<typeof CompareContractInputSchema>;

const CompareContractOutputSchema = z.object({
  favorabilityScore: z
    .number()
    .int()
    .min(1)
    .max(100)
    .describe('A score from 1-100 representing the favorability of the contract towards the user.'),
  generalAdvice: z.string().describe('General advice regarding the contract.'),
  recommendations: z.string().describe('Specific recommendations for the user regarding the contract.'),
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
  prompt: `You are an AI expert in contract law. Analyze the following contract text and determine its favorability towards the user.

Contract Text:
{{contractText}}

{{#if industryStandardInfo}}
Compare the contract against the following industry standard information:
{{{industryStandardInfo}}}
{{/if}}

Provide a favorability score from 1-100 (1 being very unfavorable, 100 being very favorable). Also, provide general advice and specific recommendations for the user.

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
