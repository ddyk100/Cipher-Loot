/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['@fhevm-sdk'],
  experimental: {
    externalDir: true,
  },
  // Empty turbopack config to acknowledge Next.js 16 default bundler
  turbopack: {},
  // Webpack fallback for compatibility (used with --webpack flag)
  webpack: (config) => {
    config.resolve.modules = [
      ...config.resolve.modules,
      path.resolve(__dirname, '../../node_modules'),
    ];
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      vue: false,
    };
    return config;
  },
}

module.exports = nextConfig
