import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Genkit uses Node.js APIs -- keep it server-side only
  serverExternalPackages: ['genkit', '@genkit-ai/googleai'],
};

export default nextConfig;
