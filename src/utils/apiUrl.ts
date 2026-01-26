const raw = import.meta.env.VITE_API_URL as string | undefined;
const FALLBACK = 'https://mutualaidnetwork.onrender.com';

/**
 * Resolve API URL with safety: must start with http/https, otherwise use fallback.
 */
export const API_URL = raw && /^https?:\/\//i.test(raw) ? raw : FALLBACK;
