// Server-side only -- never import this in client components.
// To swap AI providers: change only the `model` string below.

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { AnalysisInputSchema, AnalysisOutputSchema } from '@/lib/types';
import { CONSEQUENCE_ANALYSIS_SYSTEM_PROMPT } from './system-prompt';

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
});

export const consequenceAnalysisFlow = ai.defineFlow(
  {
    name: 'consequenceAnalysis',
    inputSchema: AnalysisInputSchema,
    outputSchema: AnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-pro',
      system: CONSEQUENCE_ANALYSIS_SYSTEM_PROMPT,
      prompt: `Analyze the following OT/ICS security scenario and return a structured consequence analysis:\n\n<scenario>\n${input.scenario}\n</scenario>`,
      output: { schema: AnalysisOutputSchema },
      config: { temperature: 0.2 },
    });

    if (!output) throw new Error('AI model returned no output. Check GEMINI_API_KEY and model availability.');
    return output;
  }
);
