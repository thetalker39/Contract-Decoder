
// src/ai/flows/scan-contract.ts
'use server';

/**
 * @fileOverview Extracts key terms, summarizes clauses, and identifies unusual provisions from contract text.
 *
 * - scanContract - A function that handles the contract scanning process.
 * - ScanContractInput - The input type for the scanContract function.
 * - ScanContractOutput - The return type for the scanContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanContractInputSchema = z.object({
  contractText: z
    .string()
    .describe('The contract text to extract key terms, summarize clauses, and identify unusual provisions.'),
});
export type ScanContractInput = z.infer<typeof ScanContractInputSchema>;

const ScanContractOutputSchema = z.object({
  summary: z.string().describe('A summary of the contract, including key terms, clause summaries, and identified unusual provisions, considering if the contract is for an artist or producer.'),
});
export type ScanContractOutput = z.infer<typeof ScanContractOutputSchema>;

export async function scanContract(input: ScanContractInput): Promise<ScanContractOutput> {
  return scanContractFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanContractPrompt',
  input: {schema: ScanContractInputSchema},
  output: {schema: ScanContractOutputSchema},
  prompt: `You are an expert legal contract analyst.
Do not use markdown bolding (e.g., **text**) in your response. Present information clearly.

  Your task is to analyze the provided contract text and generate a comprehensive summary.
  First, try to determine if the contract is primarily for an artist or a producer. This understanding should subtly guide your analysis.
  The summary should include the following:
  - Key terms and definitions (considering their relevance for an artist or producer)
  - Summaries of each clause or section (highlighting implications for the likely role)
  - Identification of any unusual or non-standard provisions (when compared to typical agreements for an artist or producer)

  Contract Text: {{{contractText}}}

  Summary:
`,
});

const scanContractFlow = ai.defineFlow(
  {
    name: 'scanContractFlow',
    inputSchema: ScanContractInputSchema,
    outputSchema: ScanContractOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
