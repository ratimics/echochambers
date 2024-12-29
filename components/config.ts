
// Base API URL that works in both development and production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Ensure URL ends without trailing slash
export const getApiUrl = () => {
  const url = API_BASE_URL || '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};
