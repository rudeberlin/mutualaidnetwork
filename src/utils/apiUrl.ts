const raw = import.meta.env.VITE_API_URL as string | undefined;
const FALLBACK = 'https://mutualaidnetwork.onrender.com';

/**
 * Resolve API URL with safety: must start with http/https, otherwise use fallback.
 */
export const API_URL = raw && /^https?:\/\//i.test(raw) ? raw : FALLBACK;

// Debug log for production troubleshooting
console.log('🔍 API_URL Configuration:', {
  raw: raw || 'undefined',
  validated: API_URL,
  isValid: raw ? /^https?:\/\//i.test(raw) : false,
  usingFallback: API_URL === FALLBACK
});
