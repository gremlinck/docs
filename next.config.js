/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.DEPLOYMENT === 'onprem' ? 'standalone' : undefined,
};

module.exports = nextConfig;
