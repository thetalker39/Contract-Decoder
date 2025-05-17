
// src/ai/flows/explain-legal-jargon.ts
'use server';

/**
 * @fileOverview Explains legal jargon within each clause of a contract at a selected level of complexity.
 *
 * - explainLegalJargon - A function that handles the explanation of legal jargon.
 * - ExplainLegalJargonInput - The input type for the explainLegalJargon function.
 * - ExplainLegalJargonOutput - The return type for the explainLegalJargon function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLegalJargonInputSchema = z.object({
  contractText: z.string().describe('The full contract text to analyze clause by clause.'),
  explanationLevel: z
    .enum(['beginner', 'intermediate', 'professional'])
    .describe('The level of explanation complexity.'),
});
export type ExplainLegalJargonInput = z.infer<typeof ExplainLegalJargonInputSchema>;

const ExplainLegalJargonOutputSchema = z.object({
  explanation: z.string().describe('A detailed breakdown of the entire contract, clause by clause. For each clause, identified jargon or complex terms are explained at the chosen complexity level, with implications and comparisons to industry standards for an artist or producer. Each explanation point should be on a new line.'),
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
The user has provided the following full contract text:
"{{{contractText}}}"

Your task is to meticulously analyze the entire contract, clause by clause. For each and every clause:
1.  Identify any legal jargon, complex terms, "slang" (industry-specific terms), or phrases that might be difficult for someone at the '{{{explanationLevel}}}' level to understand.
2.  For each piece of jargon/term identified within that specific clause, provide a detailed explanation appropriate for the '{{{explanationLevel}}}'.
3.  First, try to infer if the contract context primarily relates to an **artist** or a **producer**. This should inform your explanations.

Structure your output as follows for the entire document:
- Start with a reference to the clause (e.g., "Clause 1 - Definitions:", "Section 3.2 - Royalties:", "Regarding the paragraph starting 'Notwithstanding the foregoing...':").
- On subsequent lines, for each piece of jargon or complex term found *within that clause*:
    - Prefix the term with a hyphen or bullet point (e.g., "- Term: [Identified Jargon]").
    - Provide a detailed definition or summary in language appropriate for the '{{{explanationLevel}}}'.
    - Explain its practical implications and significance *within the context of that specific clause*.
    - If relevant, compare it to standard industry understanding or common practices for the inferred role (artist or producer). Highlight if a term is used unusually or if a clause has implications that differ from common expectations.

Ensure every clause in the provided contract text is addressed. If a clause contains no significant jargon for the selected explanation level, you can briefly state that (e.g., "Clause X: This clause appears straightforward and contains no specific jargon requiring explanation at this level.").
Present each distinct explanation (for different terms/concepts or different clauses) such that it can be easily parsed into list items (e.g., each new clause starts on a new line, and each term within it starts on a new line).

Example for 'beginner' level explanation of a fictional clause:

Clause 5. Obligations of Producer:
- Term: "Best Efforts": This means the producer has to try really hard to do what the contract says, like making a great song. It's not a guarantee of success, but they can't just do nothing.
- Term: "Deliverables": These are the specific things the producer must give to the artist/label, like the final mixed song and separate instrument tracks. For a producer, this is important to list clearly.

Begin your comprehensive clause-by-clause explanation now:
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

