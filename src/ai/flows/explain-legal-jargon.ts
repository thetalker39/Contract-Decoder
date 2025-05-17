
// src/ai/flows/explain-legal-jargon.ts
'use server';

/**
 * @fileOverview Explains legal jargon in a contract based on a selected level of complexity.
 *
 * - explainLegalJargon - A function that handles the explanation of legal jargon.
 * - ExplainLegalJargonInput - The input type for the explainLegalJargon function.
 * - ExplainLegalJargonOutput - The return type for the explainLegalJargon function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLegalJargonInputSchema = z.object({
  contractText: z.string().describe('The contract text or specific legal term(s) to explain.'),
  explanationLevel: z
    .enum(['beginner', 'intermediate', 'professional'])
    .describe('The level of explanation complexity.'),
});
export type ExplainLegalJargonInput = z.infer<typeof ExplainLegalJargonInputSchema>;

const ExplainLegalJargonOutputSchema = z.object({
  explanation: z.string().describe('The detailed explanation of the legal jargon, with each term or concept on a new line. Explanations should include implications and comparisons to standard understanding or industry practices where relevant.'),
});
export type ExplainLegalJargonOutput = z.infer<typeof ExplainLegalJargonOutputSchema>;

export async function explainLegalJargon(
  input: ExplainLegalJargonInput
): Promise<ExplainLegalJargonOutput> {
  return explainLegalJargonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLegalJargonPrompt',
  input: {schema: ExplainLegalJargonInputSchema},
  output: {schema: ExplainLegalJargonOutputSchema},
  prompt: `You are a legal expert highly skilled at explaining complex legal jargon in clear, understandable terms tailored to different audiences.
The user has provided the following text or terms from a contract:
"{{{contractText}}}"

Your task is to provide a thorough explanation for each piece of legal jargon or complex clause identified in the provided text, at the '{{{explanationLevel}}}' level of complexity.

For each term or clause explained:
1. Clearly state the term/clause being explained (e.g., "Term: Indemnification" or "Clause Analysis: Section 5.2 - Force Majeure").
2. Provide a detailed definition or summary in language appropriate for the selected explanation level.
3. Explain its practical implications and significance within the context of a contract.
4. If relevant, compare it to standard industry understanding or common practices. For example, if a term is used unusually, or if a clause has implications that differ from common expectations, highlight this.
5.  Ensure each distinct explanation (for different terms or concepts) is on a new line to allow for easy list parsing.

Format the output as a single string, with each explanation for a term or concept on a new line.
Example for 'beginner' level explanation of "Indemnification":
Indemnification: This is like a promise where one person agrees to cover the costs if the other person gets into trouble or faces losses because of something related to the contract. For example, if a company uses a song you provided and gets sued because you didn't actually have the rights to it, an indemnification clause might mean you have to pay for the company's legal fees and any damages. This is a common way to assign responsibility for potential problems.

Begin your explanation now:
`,
});

const explainLegalJargonFlow = ai.defineFlow(
  {
    name: 'explainLegalJargonFlow',
    inputSchema: ExplainLegalJargonInputSchema,
    outputSchema: ExplainLegalJargonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
