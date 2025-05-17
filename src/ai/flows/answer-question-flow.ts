
'use server';
/**
 * @fileOverview Provides answers or suggestions to user questions based on general industry knowledge.
 *
 * - answerUserQuestion - A function that handles answering user questions.
 * - AnswerUserQuestionInput - The input type for the answerUserQuestion function.
 * - AnswerUserQuestionOutput - The return type for the answerUserQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerUserQuestionInputSchema = z.object({
  question: z.string().describe('The user\'s question.'),
});
export type AnswerUserQuestionInput = z.infer<typeof AnswerUserQuestionInputSchema>;

const AnswerUserQuestionOutputSchema = z.object({
  answer: z.string().describe('A detailed answer or set of suggestions responding to the user\'s question, considering general industry practices related to contracts and legal matters. Each point or suggestion should be on a new line.'),
});
export type AnswerUserQuestionOutput = z.infer<typeof AnswerUserQuestionOutputSchema>;

export async function answerUserQuestion(input: AnswerUserQuestionInput): Promise<AnswerUserQuestionOutput> {
  return answerUserQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerUserQuestionPrompt',
  input: {schema: AnswerUserQuestionInputSchema},
  output: {schema: AnswerUserQuestionOutputSchema},
  prompt: `You are an AI assistant for a contract analysis application. Your role is to provide helpful answers and suggestions to user questions.
Do not use markdown bolding (e.g., **text**) in your response. Present information clearly.

The user's question is:
"{{{question}}}"

Please provide a comprehensive answer or set of suggestions.
When formulating your response, consider general industry knowledge, best practices, and common understanding related to contracts, legal terms, and business agreements, particularly in creative fields if applicable.
If the question is unclear or too broad, you can ask for clarification or provide general guidance.
Structure your answer clearly, with distinct points or suggestions on new lines for easy readability and display in a list format.
For example, if a user asks "What should I look out for in a distribution agreement?", you might list key clauses and considerations.
Ensure your explanations are thorough and provide substantial detail.
`,
});

const answerUserQuestionFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionFlow',
    inputSchema: AnswerUserQuestionInputSchema,
    outputSchema: AnswerUserQuestionOutputSchema,
  },
  async (input: AnswerUserQuestionInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
