
// src/ai/flows/rewrite-contract-terms.ts
'use server';

/**
 * @fileOverview Rewrites a contract with more favorable terms for a producer or artist,
 * potentially incorporating a user-specified desired amount for a fee or advance.
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
  desiredAmount: z.number().optional().describe('A specific monetary amount the user desires to be incorporated into relevant clauses, such as an advance or fee.'),
  isRecoupable: z.boolean().optional().describe('If a desiredAmount is provided, specifies whether it should be treated as a recoupable advance (true) or a non-recoupable fee (false).'),
});

export type RewriteContractTermsInput = z.infer<
  typeof RewriteContractTermsInputSchema
>;

const RewriteContractTermsOutputSchema = z.object({
  rewrittenContract: z
    .string()
    .describe('The rewritten contract with more favorable terms. The rewrite should be comprehensive and detailed, addressing specific clauses to improve them based on industry standards if provided, or general fairness principles. If a desiredAmount is provided, it should be skillfully woven into appropriate clauses (e.g., advance, fee payment).'),
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
6.  **Incorporate User Preferences (If Provided)**:
    {{#if desiredAmount}}
    The user has specified a desired monetary amount of \${{{desiredAmount}}}.
      {{#if isRecoupable}}
      This amount should be integrated into a relevant clause (e.g., producer advance, artist advance) as a **recoupable advance**.
      {{else}}
      This amount should be integrated into a relevant clause (e.g., production fee, creative fee) as a **non-recoupable fee**.
      {{/if}}
    Ensure this amount is naturally and appropriately incorporated into the rewritten contract text, replacing or adjusting existing figures where suitable.
    {{/if}}
7.  **Output**: Provide the complete text of the rewritten contract.

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

```