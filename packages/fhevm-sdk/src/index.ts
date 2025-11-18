/**
 * Universal FHEVM SDK
 * Clean, simple implementation that actually works
 */

// Core FHEVM functionality
export * from './core/fhevm';
export * from './core/contracts';

// Framework adapters - explicit exports to avoid conflicts
export { useWallet, useFhevm, useContract, useDecrypt, useEncrypt } from './adapters/react';
export { useWalletVue, useFhevmVue, useContractVue, useDecryptVue, useEncryptVue, useFhevmOperationsVue } from './adapters/vue';
export { FhevmNode } from './adapters/node';
