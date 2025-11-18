/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fhevm-sdk'],
  webpack: (config, { isServer }) => {
    // Ignore optional peer dependencies that are not used in this project
    config.resolve.fallback = {
      ...config.resolve.fallback,
      vue: false,
    };
    return config;
  },
}

module.exports = nextConfig
