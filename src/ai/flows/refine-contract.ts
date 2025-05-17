
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
    z.string().optional().describe('Industry standard information to compare the contract against, specific to an artist or producer.'),
});

export type RefineContractInput = z.infer<typeof RefineContractInputSchema>;

const RefineContractOutputSchema = z.object({
  rewrittenContract:
    z.string().describe('The rewritten contract with more favorable terms for an artist or producer.'),
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
  prompt: `You are an expert contract lawyer specializing in music contracts for both artists and producers.
Do not use markdown bolding (e.g., **text**) in your response. Present information clearly.

First, determine if the provided contract is primarily for an artist or a producer.
You will rewrite the contract to have more favorable terms for that identified role.

{{#if aggressiveRewrite}}
You will aggressively rewrite the contract, removing unfavorable clauses.
{{else}}
You will rewrite the contract with more favorable terms, but without removing any clauses unless absolutely necessary for fairness.
{{/if}}

{{#if industryStandardInfo}}
You will compare the contract against the following industry standard information, tailoring it to the artist or producer context:
{{{industryStandardInfo}}}
{{/if}}

If the contract is for a producer and involves an advance or fee, aim to rewrite terms that align with an industry standard compensation range of $2,500 - $5,000 for such services, assuming it's appropriate and not overridden by other instructions like aggressive rewrite.

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
