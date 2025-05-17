
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
  overallSummary: z.string().describe('A concise summary paragraph highlighting the most significant overall issues and unfavorable aspects of the contract, comparing them to industry standards (e.g., "This is a Music Producer Agreement... the terms are highly unfavorable because X, Y, Z..."). This summary should consider if the contract is for an artist or producer.'),
  generalAdvice: z.string().describe('Detailed, point-by-point flagged clauses or general advice regarding the contract, with each point on a new line, referencing specific clauses where applicable and explaining why it might be unfavorable compared to industry standards for an artist or producer as applicable.'),
  recommendations: z.string().describe('Specific, actionable recommendations for the user regarding the contract, with each point on a new line, referencing specific clauses, explaining why changes are needed relative to industry standards (for an artist or producer), and suggesting specific negotiable figures or ranges where applicable (e.g., "Producer Advance: Recommend negotiating for $2,500 - $5,000 instead of $X").'),
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
  prompt: `You are an AI expert in contract law with deep knowledge of industry standards, particularly in music and creative fields for both artists and producers.
Do not use markdown bolding (e.g., **text**) in your response. Present information clearly.

First, analyze the following contract text to determine if it primarily concerns an artist or a producer. This determination will inform your subsequent analysis and recommendations.

Contract Text:
{{{contractText}}}

Your analysis must include the following, adhering strictly to the output schema and tailoring your points to the identified role (artist or producer):
1. Favorability Score: A numerical score from 1-100 (1 being very unfavorable, 100 being very favorable to the user).
2. Overall Summary: Provide a concise summary paragraph (1-3 sentences) identifying the type of agreement (if discernible, e.g., producer agreement, recording contract) and highlighting the most significant overall issues or unfavorable aspects. Explain why these aspects are problematic by briefly comparing them to common industry standards or typical fair terms for the identified role (artist or producer). This should be a high-level overview. Example: "This appears to be a 'Work For Hire' producer agreement. The terms are generally unfavorable to the producer primarily due to an exceptionally low fee (e.g. $500, where $2,500-$5,000 might be standard), absence of royalty provisions, and an assignment of all rights, which deviate significantly from standard industry compensation and rights for producers."
3. Flagged Clauses (General Advice): Provide detailed, point-by-point advice on specific clauses or aspects of the contract. For each point:
    *   Clearly reference the specific clause or section of the contract it pertains to (e.g., "Clause 3.1:", "Section B:"). If no specific clause number is present for a concept, describe the relevant part of the contract.
    *   Explain the implications of this clause for the user (artist or producer).
    *   If a clause is unfavorable or problematic, explain why by comparing it to common industry standards or typical fair terms for the identified role. Highlight deviations from these standards.
    *   Present each piece of advice on a new line.
4. Recommendations: Offer specific, actionable recommendations for the user. For each recommendation:
    *   Clearly reference the specific clause or section.
    *   Suggest concrete changes or points for negotiation.
    *   Crucially, where monetary values, percentages, or quantifiable terms are discussed (e.g., advances, royalties, deadlines, term lengths), provide specific, justifiable numerical ranges or figures that would be considered more favorable or aligned with industry standards for the identified role. For example: "Producer Advance (Clause 4.2): The offered advance of $500 is significantly below industry standard for this type of project. Recommend negotiating for an advance in the range of $2,500 - $5,000." or "Artist Royalty (Section 5): The 10% royalty rate is low for an established artist. Aim for a rate between 15-20%."
    *   Explain how these changes would align the contract more closely with industry standards or make it fairer for the user (artist or producer).
    *   Present each recommendation on a new line.

Ensure that the output for 'Flagged Clauses (General Advice)' and 'Recommendations' are well-formatted with distinct points on new lines for easy parsing and display in a list format. Your explanations must be thorough and provide substantial detail, always considering if the primary party is an artist or a producer.
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
