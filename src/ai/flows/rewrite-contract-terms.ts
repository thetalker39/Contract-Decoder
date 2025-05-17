// src/ai/flows/rewrite-contract-terms.ts
'use server';

/**
 * @fileOverview Rewrites a contract with more favorable terms for a producer or artist.
 *
 * - rewriteContractTerms - A function that rewrites contract terms.
 * - RewriteContractTermsInput - The input type for the rewriteContractTerms function.
 * - RewriteContractTermsOutput - The return type for the rewriteContractTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteContractTermsInputSchema = z.object({
  contractText: z.string().describe('The contract text to rewrite.'),
  aggressiveRewrite: z
    .boolean()
    .describe(
      'Whether to aggressively rewrite the contract, removing unfavorable clauses.'
    ),
  industryStandardInfo: z
    .string()
    .optional()
    .describe('Industry standard information to compare the contract against.'),
});

export type RewriteContractTermsInput = z.infer<
  typeof RewriteContractTermsInputSchema
>;

const RewriteContractTermsOutputSchema = z.object({
  rewrittenContract: z
    .string()
    .describe('The rewritten contract with more favorable terms.'),
});

export type RewriteContractTermsOutput = z.infer<
  typeof RewriteContractTermsOutputSchema
>;

export async function rewriteContractTerms(
  input: RewriteContractTermsInput
): Promise<RewriteContractTermsOutput> {
  return rewriteContractTermsFlow(input);
}

const rewriteContractTermsPrompt = ai.definePrompt({
  name: 'rewriteContractTermsPrompt',
  input: {schema: RewriteContractTermsInputSchema},
  output: {schema: RewriteContractTermsOutputSchema},
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

const rewriteContractTermsFlow = ai.defineFlow(
  {
    name: 'rewriteContractTermsFlow',
    inputSchema: RewriteContractTermsInputSchema,
    outputSchema: RewriteContractTermsOutputSchema,
  },
  async input => {
    const {output} = await rewriteContractTermsPrompt(input);
    return output!;
  }
);
