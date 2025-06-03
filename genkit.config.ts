// genkit.config.ts (now at project root)
/**
 * @fileOverview Genkit configuration file.
 * This file imports dev.ts to ensure all defined flows and prompts
 * are registered with the Genkit system when Genkit starts.
 */
console.log('[MaarifCompass Genkit] genkit.config.ts (root) is being loaded.');

import './src/ai/dev'; // Adjusted import path

// You can add other Genkit-specific configurations here if needed in the future.
// For example, configuring default models, plugins beyond googleAI, etc.

// Minimal export to make this a valid TypeScript module
export default {};
