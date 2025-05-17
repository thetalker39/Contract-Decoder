'use server';

/**
 * @fileOverview Analyzes the favorability of a contract towards the user.
 *
 * - analyzeContractFavorability - A function that analyzes the favorability of a contract.
 * - AnalyzeContractFavorabilityInput - The input type for the analyzeContractFavorability function.
 * - AnalyzeContractFavorabilityOutput - The return type for the analyzeContractFavorability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContractFavorabilityInputSchema = z.object({
  contractText: z.string().describe('The text of the contract to analyze.'),
});
export type AnalyzeContractFavorabilityInput = z.infer<typeof AnalyzeContractFavorabilityInputSchema>;

const AnalyzeContractFavorabilityOutputSchema = z.object({
  favorabilityScore: z
    .number()
    .int()
    .min(1)
    .max(100)
    .describe('A score from 1-100 representing the favorability of the contract towards the user.'),
  generalAdvice: z.string().describe('General advice regarding the contract.'),
  recommendations: z.string().describe('Specific recommendations for the user regarding the contract.'),
});
export type AnalyzeContractFavorabilityOutput = z.infer<typeof AnalyzeContractFavorabilityOutputSchema>;

export async function analyzeContractFavorability(
  input: AnalyzeContractFavorabilityInput
): Promise<AnalyzeContractFavorabilityOutput> {
  return analyzeContractFavorabilityFlow(input);
}

const analyzeContractFavorabilityPrompt = ai.definePrompt({
  name: 'analyzeContractFavorabilityPrompt',
  input: {schema: AnalyzeContractFavorabilityInputSchema},
  output: {schema: AnalyzeContractFavorabilityOutputSchema},
  prompt: `You are an AI expert in contract law. Analyze the following contract text and determine its favorability towards the user.

Contract Text:
{{contractText}}

Provide a favorability score from 1-100 (1 being very unfavorable, 100 being very favorable). Also, provide general advice and specific recommendations for the user.

Ensure that the output is well-formatted and easy to understand. Follow the output schema strictly.
`,
});

const analyzeContractFavorabilityFlow = ai.defineFlow(
  {
    name: 'analyzeContractFavorabilityFlow',
    inputSchema: AnalyzeContractFavorabilityInputSchema,
    outputSchema: AnalyzeContractFavorabilityOutputSchema,
  },
  async input => {
    const {output} = await analyzeContractFavorabilityPrompt(input);
    return output!;
  }
);
