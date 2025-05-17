
// SummarizeContract.ts
'use server';

/**
 * @fileOverview Summarizes contract text by extracting key terms,
 * summarizing clauses, and identifying unusual provisions.
 *
 * - summarizeContract - A function that handles the contract summarization process.
 * - SummarizeContractInput - The input type for the summarizeContract function.
 * - SummarizeContractOutput - The return type for the summarizeContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContractInputSchema = z.object({
  contractText: z
    .string()
    .describe('The contract text to be summarized and analyzed.'),
});
export type SummarizeContractInput = z.infer<typeof SummarizeContractInputSchema>;

const SummarizeContractOutputSchema = z.object({
  summary: z.string().describe('A detailed, structured summary of the contract including key terms, clause summaries (with clause numbers/references), and identified unusual provisions with explanations against industry standards. Each major point should be on a new line.'),
});
export type SummarizeContractOutput = z.infer<typeof SummarizeContractOutputSchema>;

export async function summarizeContract(input: SummarizeContractInput): Promise<SummarizeContractOutput> {
  return summarizeContractFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeContractPrompt',
  input: {schema: SummarizeContractInputSchema},
  output: {schema: SummarizeContractOutputSchema},
  prompt: `You are an expert legal contract analyst. Your task is to analyze the provided contract text and generate a comprehensive, detailed, and structured summary.

Contract Text:
{{{contractText}}}

Please structure your summary as follows, with each distinct point or analysis on a new line:

Key Terms and Definitions:
- [Term 1]: [Detailed definition and its significance in this contract. Compare with industry standard definitions if relevant.]
- [Term 2]: [Detailed definition and its significance.]
...

Summaries of each clause or section:
- [Clause/Section Number/Reference e.g., Clause 1 or Section A]: [Detailed summary of this clause/section. Explain its purpose and implications for the parties involved. If the clause seems standard, mention that. If it deviates from industry norms, explain how and why it might be significant.]
- [Clause/Section Number/Reference e.g., Clause 2]: [Detailed summary...]
...

Identification of any unusual or non-standard provisions:
- [Clause/Section Number/Reference containing the provision]: [Clearly identify the unusual or non-standard provision. Explain in detail why it is considered unusual or non-standard by comparing it to typical industry practices or common legal standards. Discuss potential risks, benefits, or points of attention for the user regarding this provision.]
- [Another unusual provision...]: [Detailed explanation...]
...

Ensure your analysis is thorough. For each summarized clause or identified provision, clearly state its reference (e.g., "Clause 3.1", "Section B.2").
When discussing unusual provisions, provide context by comparing them to what is generally expected or considered standard in similar contracts or industries.
The output should be a single string, but use newlines to separate distinct points and sections as outlined above.
`,
});

const summarizeContractFlow = ai.defineFlow(
  {
    name: 'summarizeContractFlow',
    inputSchema: SummarizeContractInputSchema,
    outputSchema: SummarizeContractOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

