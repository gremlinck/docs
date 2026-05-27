import { callClaude } from './providers/claude.js';
import { callGemini } from './providers/gemini.js';

// Single entry point for all AI calls across Varo AI modules.
// Switch provider via AI_PROVIDER env var — no other code changes needed.
export async function callVaroAnalyst(systemPrompt, userMessage, options = {}) {
  const provider = process.env.AI_PROVIDER || 'claude';

  if (provider === 'claude') {
    return callClaude(systemPrompt, userMessage, options);
  }
  return callGemini(systemPrompt, userMessage, options);
}
