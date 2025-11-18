#!/bin/bash
set -e

# Copy fhevm-sdk to nextjs node_modules
mkdir -p packages/nextjs/node_modules/@fhevm-sdk
cp -r packages/fhevm-sdk/dist/. packages/nextjs/node_modules/@fhevm-sdk/
cp packages/fhevm-sdk/package.json packages/nextjs/node_modules/@fhevm-sdk/

# Build nextjs
pnpm --filter cipher-loot-web build

