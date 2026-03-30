const PROD_URL = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path: string): string => {
  if (import.meta.env.DEV) {
    return `/api${path}`;
  }
  return `${PROD_URL}${path}`;
};
