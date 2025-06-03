// Environment variables are now expected to be loaded by the preload script specified in package.json (e.g., -r ./src/ai/load-env.ts)

console.log('[MaarifCompass Genkit] src/ai/dev.ts is being loaded. Importing flows...');

// Flows will be imported for their side effects in this file.
import './flows/chatFlow';
import './flows/indexingFlow';

console.log('[MaarifCompass Genkit] Flows imported in src/ai/dev.ts.');
