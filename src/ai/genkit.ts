import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import dotenv from 'dotenv'; // Removed: Handled by load-env.ts for Genkit CLI context

// dotenv.config(); // Removed: Handled by load-env.ts for Genkit CLI context

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.NEXT_GEMINI_API_KEY,
      // You can also specify default options for Gemini here if needed
      // مثلا: defaultModel: 'gemini-1.5-flash-latest', // Or another specific model
      // defaultVisionModel: 'gemini-1.5-flash-latest', // For vision capabilities
    }),
  ],
  // The model specified here acts as a default if not specified in a generate call
  // However, when using the googleAI plugin with an API key,
  // it's often cleaner to let the plugin manage model selection or specify in prompts/flows.
  // If a default is desired globally:
  model: 'googleai/gemini-2.0-flash', // This model name might need adjustment based on API key capabilities and desired model, e.g., 'gemini-1.5-flash-latest'
});
