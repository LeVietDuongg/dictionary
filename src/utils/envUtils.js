/**
 * Environment Variables Utility
 * Provides functions for verifying and handling environment variables
 */

export function checkRequiredEnvVars() {
  const requiredVars = {
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    VITE_GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return {
    allPresent: missingVars.length === 0,
    missingVars
  };
}

export function maskApiKey(key) {
  if (!key) return '';
  if (key.length <= 8) return '********';
  return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
}

export function debugEnvVars() {
  if (import.meta.env.DEV) {
    console.log('Environment Variables Status:');
    console.log(`VITE_OPENAI_API_KEY: ${import.meta.env.VITE_OPENAI_API_KEY ? 'Present ✓' : 'Missing ✗'}`);
    console.log(`VITE_GOOGLE_API_KEY: ${import.meta.env.VITE_GOOGLE_API_KEY ? 'Present ✓' : 'Missing ✗'}`);
  }
}
