
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const result = dotenv.config({ path: envPath, override: true }); // 'override: true' ensures these take precedence

if (result.error) {
  console.warn(`[MaarifCompass Genkit Env Loader] Error loading .env.local from ${envPath}: ${result.error.message}`);
  // Attempt to load .env as a fallback if .env.local fails or doesn't exist
  const fallbackEnvPath = path.resolve(process.cwd(), '.env');
  const fallbackResult = dotenv.config({ path: fallbackEnvPath, override: true });
  if (fallbackResult.error) {
    console.warn(`[MaarifCompass Genkit Env Loader] Error loading .env from ${fallbackEnvPath}: ${fallbackResult.error.message}`);
  } else {
    if (fallbackResult.parsed) {
      console.log(`[MaarifCompass Genkit Env Loader] Successfully loaded fallback .env from ${fallbackEnvPath}`);
    } else {
      console.warn(`[MaarifCompass Genkit Env Loader] Fallback .env found but was empty or unreadable at ${fallbackEnvPath}`);
    }
  }
} else {
  if (result.parsed) {
    console.log(`[MaarifCompass Genkit Env Loader] Successfully loaded .env.local from ${envPath}`);
  } else {
     console.warn(`[MaarifCompass Genkit Env Loader] .env.local found but was empty or unreadable at ${envPath}`);
  }
}

// For debugging, explicitly check the Firebase API key that was causing issues
// console.log('[MaarifCompass Genkit Env Loader] NEXT_PUBLIC_FIREBASE_API_KEY loaded:', 
//   process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Yes (' + process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5) + '...)' : 'No - THIS IS THE PROBLEM');
// console.log('[MaarifCompass Genkit Env Loader] NEXT_GEMINI_API_KEY loaded:',
//   process.env.NEXT_GEMINI_API_KEY ? 'Yes (' + process.env.NEXT_GEMINI_API_KEY.substring(0,5) + '...)' : 'No');
