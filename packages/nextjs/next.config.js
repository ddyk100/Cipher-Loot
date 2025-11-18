/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['@fhevm-sdk'],
  webpack: (config, { isServer }) => {
    // Add alias for workspace package
    config.resolve.alias = {
      ...config.resolve.alias,
      '@fhevm-sdk': path.resolve(__dirname, '../fhevm-sdk/dist'),
    };
    
    // Ignore optional peer dependencies that are not used in this project
    config.resolve.fallback = {
      ...config.resolve.fallback,
      vue: false,
    };
    return config;
  },
}

module.exports = nextConfig
