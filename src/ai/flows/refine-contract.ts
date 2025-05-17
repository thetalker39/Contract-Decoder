// src/ai/flows/refine-contract.ts
'use server';

/**
 * @fileOverview Rewrites a contract with more favorable terms for a producer or artist.
 *
 * - refineContract - A function that refines contract terms.
 * - RefineContractInput - The input type for the refineContract function.
 * - RefineContractOutput - The return type for the refineContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineContractInputSchema = z.object({
  contractText: z.string().describe('The contract text to rewrite.'),
  aggressiveRewrite:
    z.boolean().describe('Whether to aggressively rewrite the contract, removing unfavorable clauses.'),
  industryStandardInfo:
    z.string().optional().describe('Industry standard information to compare the contract against.'),
});

export type RefineContractInput = z.infer<typeof RefineContractInputSchema>;

const RefineContractOutputSchema = z.object({
  rewrittenContract:
    z.string().describe('The rewritten contract with more favorable terms.'),
});

export type RefineContractOutput = z.infer<typeof RefineContractOutputSchema>;

export async function refineContract(
  input: RefineContractInput
): Promise<RefineContractOutput> {
  return refineContractFlow(input);
}

const refineContractPrompt = ai.definePrompt({
  name: 'refineContractPrompt',
  input: {schema: RefineContractInputSchema},
  output: {schema: RefineContractOutputSchema},
  prompt: `You are an expert contract lawyer specializing in music contracts.

You will rewrite the provided contract to have more favorable terms for a producer or artist.

{{#if aggressiveRewrite}}
You will aggressively rewrite the contract, removing unfavorable clauses.
{{else}}
You will rewrite the contract with more favorable terms, but without removing any clauses.
{{/if}}

{{#if industryStandardInfo}}
You will compare the contract against the following industry standard information:
{{{industryStandardInfo}}}
{{/if}}

Contract text:
{{{contractText}}}`, 
});

const refineContractFlow = ai.defineFlow(
  {
    name: 'refineContractFlow',
    inputSchema: RefineContractInputSchema,
    outputSchema: RefineContractOutputSchema,
  },
  async input => {
    const {output} = await refineContractPrompt(input);
    return output!;
  }
);
