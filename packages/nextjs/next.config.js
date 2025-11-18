/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['@fhevm-sdk'],
  experimental: {
    externalDir: true,
  },
  webpack: (config, { isServer }) => {
    // Ensure @fhevm-sdk can be resolved from parent directory
    config.resolve.modules = [
      ...config.resolve.modules,
      path.resolve(__dirname, '../../node_modules'),
    ];
    
    // Allow .js imports to resolve to .ts files (for @fhevm-sdk source)
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
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
