# Cipher Loot

Cipher Loot is an on-chain loot draw where players receive encrypted rewards that only they can decrypt. It demonstrates how Zama’s Fully Homomorphic Encryption Virtual Machine (FHEVM) enables verifiable randomness, secret prize storage, and user-controlled reveal flows in a single-player gacha experience.

## 1. Vision & Problem Statement

| Topic | Description |
| --- | --- |
| **Vision** | Deliver a luxury “Baroque” loot experience where every draw is provably fair, private, and auditable. |
| **Problem** | Conventional loot boxes leak probabilities, expose interim rewards, and require trust in opaque server logic. Players cannot verify that rolls were truly random nor keep drops private until they wish to show them. |
| **FHE in Gaming** | FHE allows the smart contract to roll random numbers, classify rarity, and store the resulting prize **without ever revealing the plaintext on-chain**. Players receive ciphertext handles that only they can decrypt via an EIP-712 authorization. This guarantees: <br>• Immutable on-chain logic <br>• Hidden state per wallet <br>• One-click reveal when the player is ready |

## 2. Gameplay Tutorial (Web)

1. **Open the site** – Visit the deployed Cipher Loot web app.  
2. **Connect a wallet** – Click “Connect” and choose a supported wallet (MetaMask, Coinbase, WalletConnect, OKX, Trust, or Rabby).  
3. **Check status** – In the Wallet panel, make sure the network shows Sepolia and the FHE status shows “Ready”.  
4. **Draw loot** – Click “⚔ Draw Encrypted Loot” and confirm the transaction in your wallet.  
5. **View your history** – Scroll to the **Collection** section to see all your draws with time and transaction link.  
6. **Reveal a card** – Click “Decrypt” on any entry to reveal its rarity and description.  
7. **Keep or share** – You can leave some entries encrypted, or reveal them and share the results with others.  

## 3. Technical Architecture & Flow

### Stack

- **Frontend**: Next.js 14 + Tailwind, custom Baroque theme, wallet modal, history state machine.  
- **SDK**: `@fhevm-sdk` React hooks (wallet, FHE initialization, contract binding, batch decryption).  
- **Smart Contract**: `packages/hardhat/contracts/CipherLoot.sol` – uses `FHE.randEuint16()`, `FHE.rem()`, `FHE.select()`, and encrypted storage per wallet.  
- **Network**: Ethereum Sepolia, deployed contract `0xde33E2d0b0a10c0492Eb456C294589ceDcbB349f`.
- **Relayer**: Zama Relayer SDK (`https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs`) for user-controlled decryptions.  

### Flow Diagram

```
┌───────────────┐        1. draw()                ┌────────────────────┐
│  Wallet UI    │ ──────────────────────────────► │ CipherLoot.sol     │
│ (Next.js)     │                                 │ • FHE rand roll    │
│               │ ◄────────────────────────────── │ • Store ciphertext │
└──────┬────────┘        2. LootDrawn emits       └──────┬─────────────┘
       │                                               3 │ ciphertext refs
       │ 4. loadHistory()                               │
       ▼                                                ▼
┌────────────────┐   5. decrypt request   ┌───────────────────────────┐
│ @fhevm-sdk     │ ─────────────────────► │ Zama Relayer + User Sig   │
│ (batchDecrypt) │ ◄───────────────────── │ returns plaintext handles │
└──────┬─────────┘   6. resolved rarity   └──────┬────────────────────┘
       │                                         │
       ▼                                         ▼
┌────────────────────────┐          ┌────────────────────────┐
│ Collection State Store │  7. UI   │ Player reveals / keeps │
│ • Draw list            │ ─────────│ loot private           │
│ • Decrypt state        │          └────────────────────────┘
└────────────────────────┘
```

## 4. Acknowledgement

Grateful thanks to **Zama** for providing the FHEVM documentation, tooling, and relayer infrastructure that make Cipher Loot possible.
