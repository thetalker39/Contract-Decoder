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
  summary: z.string().describe('A summary of the contract, including key terms, clause summaries, and identified unusual provisions.'),
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

  Your task is to analyze the provided contract text and generate a comprehensive summary.
  The summary should include the following:
  - Key terms and definitions
  - Summaries of each clause or section
  - Identification of any unusual or non-standard provisions

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
