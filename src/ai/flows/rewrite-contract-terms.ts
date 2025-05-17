
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
    .describe('Industry standard information to compare the contract against. This can be used to guide the rewrite towards more common and fair terms.'),
});

export type RewriteContractTermsInput = z.infer<
  typeof RewriteContractTermsInputSchema
>;

const RewriteContractTermsOutputSchema = z.object({
  rewrittenContract: z
    .string()
    .describe('The rewritten contract with more favorable terms. The rewrite should be comprehensive and detailed, addressing specific clauses to improve them based on industry standards if provided, or general fairness principles.'),
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
  prompt: `You are an expert contract lawyer specializing in music contracts, skilled at drafting clear, fair, and detailed contract language.
Your task is to rewrite the provided contract text to be more favorable for a producer or artist.

Original Contract text:
{{{contractText}}}

{{#if industryStandardInfo}}
Consider the following industry standard information when rewriting the contract:
{{{industryStandardInfo}}}
{{/if}}

Rewrite Instructions:
1.  **Identify Unfavorable Clauses**: Carefully review the original contract and identify clauses that are unfavorable to the artist/producer.
2.  **Propose Favorable Alternatives**: For each unfavorable clause, draft a rewritten version that is more equitable and aligns better with the artist's/producer's interests. If industry standards are provided, use them as a guide.
3.  **Level of Aggression**:
    {{#if aggressiveRewrite}}
    You will perform an **aggressive rewrite**. This means you should not hesitate to significantly alter or remove clauses that are highly detrimental. Be bold in your revisions to strongly favor the artist/producer.
    {{else}}
    You will perform a **standard rewrite**. Aim for a balanced yet more favorable contract. Improve terms and clarify language, but major clause removals should only be done if they are exceptionally one-sided and have no reasonable counter-negotiation point.
    {{/if}}
4.  **Clarity and Detail**: Ensure the rewritten contract is clear, unambiguous, and detailed. Vague terms should be made specific.
5.  **Maintain Contract Integrity**: While making it more favorable, ensure the rewritten contract remains a legally sound and coherent document.
6.  **Output**: Provide the complete text of the rewritten contract.

The goal is a significantly improved contract for the artist/producer. Be thorough and meticulous in your rewriting.
`,
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
