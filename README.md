# Cipher Loot

On-chain encrypted loot box where players draw mystery rewards that only they can decrypt. Built with Zama's FHEVM for verifiable randomness, private prize storage, and user-controlled reveals.

## Why FHE?

Traditional loot boxes expose interim results and rely on opaque server logic. FHE solves this:

- **Verifiable fairness** – Random rolls computed on-chain, immutable and auditable
- **True privacy** – Rewards stored as ciphertext, invisible until you choose to reveal
- **User control** – Only your wallet signature can decrypt your prizes

## Features

- 🎲 Encrypted random draws with configurable rarity (1% SSR, 9% SR, 90% R)
- 🔐 Per-wallet private storage using `euint16` encrypted types
- 🔓 EIP-712 authorized decryption via Zama Relayer
- 🎨 Baroque-themed UI with real-time status feedback

## Quick Start

```bash
git clone https://github.com/ddyk100/Cipher-Loot.git
cd Cipher-Loot
pnpm install
pnpm dev
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, Tailwind CSS |
| SDK | `@fhevm-sdk` React hooks |
| Contract | Solidity + FHEVM (`FHE.randEuint16`, `FHE.select`) |
| Network | Ethereum Sepolia |

## Architecture

```
User clicks Draw
       │
       ▼
┌──────────────────────────────────────────────┐
│  CipherLoot.sol (FHEVM)                      │
│  • FHE.randEuint16() → encrypted roll        │
│  • FHE.select() → encrypted rarity           │
│  • Store euint16 per wallet                  │
└──────────────────────────────────────────────┘
       │
       ▼ emits handles (bytes32)
       │
User clicks Decrypt
       │
       ▼
┌──────────────────────────────────────────────┐
│  Zama Relayer + EIP-712 Signature            │
│  • Verify wallet ownership                   │
│  • Return decrypted values                   │
└──────────────────────────────────────────────┘
       │
       ▼
UI reveals: SSR / SR / R + prize name
```

## Tests

```bash
pnpm test
```

```
CipherLoot
  ✔ stores encrypted draws and emits events
  ✔ supports pagination helpers
  ✔ reverts for invalid draw ids

3 passing
```

## Contract

**Address**: `0xde33E2d0b0a10c0492Eb456C294589ceDcbB349f`

[View on Etherscan](https://sepolia.etherscan.io/address/0xde33E2d0b0a10c0492Eb456C294589ceDcbB349f)

## Acknowledgement

Thanks to **Zama** for FHEVM documentation, tooling, and relayer infrastructure.

## License

MIT
