
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
  generalAdvice: z.string().describe('General advice regarding the contract, with each point on a new line, referencing specific clauses where applicable and explaining why it might be unfavorable compared to industry standards.'),
  recommendations: z.string().describe('Specific, actionable recommendations for the user regarding the contract, with each point on a new line, referencing specific clauses, explaining why changes are needed relative to industry standards, and suggesting specific negotiable figures or ranges where applicable (e.g., "Producer Advance: Recommend negotiating for $2,500 - $5,000 instead of $X").'),
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
  prompt: `You are an AI expert in contract law with deep knowledge of industry standards, particularly in music and creative fields. Analyze the following contract text and determine its favorability towards the user (e.g., an artist or producer).

Contract Text:
{{{contractText}}}

Your analysis should include:
1.  **Favorability Score**: A numerical score from 1-100 (1 being very unfavorable, 100 being very favorable to the user).
2.  **General Advice**: Provide detailed general advice. For each point of advice:
    *   Clearly reference the specific clause or section of the contract it pertains to (e.g., "Clause 3.1:", "Section B:").
    *   Explain the implications of this clause for the user.
    *   If a clause is unfavorable or problematic, explain *why* by comparing it to common industry standards or typical fair terms. Highlight deviations from these standards.
    *   Present each piece of advice on a new line.
3.  **Recommendations**: Offer specific, actionable recommendations for the user. For each recommendation:
    *   Clearly reference the specific clause or section.
    *   Suggest concrete changes or points for negotiation.
    *   **Crucially, where monetary values, percentages, or quantifiable terms are discussed (e.g., advances, royalties, deadlines, term lengths), provide specific, justifiable numerical ranges or figures that would be considered more favorable or aligned with industry standards. For example: "Clause 4.2 (Advance): The offered advance of $500 is significantly below industry standard for this type of project. Recommend negotiating for an advance in the range of $2,500 - $5,000." or "Section 5 (Royalties): The 10% royalty rate is low. Aim for a rate between 15-20%."**
    *   Explain how these changes would align the contract more closely with industry standards or make it fairer for the user.
    *   Present each recommendation on a new line.

Ensure that the output is well-formatted, with distinct points on new lines for easy parsing and display in a list format. Follow the output schema strictly.
Your explanations must be thorough and provide substantial detail.
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

```