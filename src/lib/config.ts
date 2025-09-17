/**
 * Application configuration
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  },
  app: {
    name: 'Async Coder',
    version: '1.0.0',
  },
} as const;

export default config;
