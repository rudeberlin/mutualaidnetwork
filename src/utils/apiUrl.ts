const raw = import.meta.env.VITE_API_URL as string | undefined;
const FALLBACK = 'https://mutualaidnetwork.onrender.com';

/**
 * Resolve API URL with safety: must start with http/https, otherwise use fallback.
 */
export const API_URL = raw && /^https?:\/\//i.test(raw) ? raw : FALLBACK;

// Debug log for production troubleshooting
if (typeof window !== 'undefined') {
  console.log('🔍 Frontend API_URL Configuration:', {
    raw_env: raw || 'undefined',
    raw_length: raw ? raw.length : 0,
    raw_first_50_chars: raw ? raw.substring(0, 50) : 'undefined',
    validated: API_URL,
    isValid: raw ? /^https?:\/\//i.test(raw) : false,
    usingFallback: API_URL === FALLBACK,
    env_keys: Object.keys(import.meta.env).filter(k => k.includes('API') || k.includes('VITE'))
  });
}
