## PRD: Cipher Loot

### 1. Product Overview

- **Product name**: Cipher Loot  
- **One-line description**:  
  Cipher Loot is an FHE-powered loot box game on the Sepolia Ethereum testnet, where every draw is computed on encrypted data and only you can decrypt your prize.  
- **Positioning**: Minimal FHE/FHEVM loot-box demo to showcase “encrypted computation + private results” with a very short loop.  
- **Target users**: Web3 users and developers who care about smart contracts, on-chain games, and privacy (especially FHE).

### 2. Product Goals

- **G1: Show the FHEVM experience** – Draws run over ciphertext, and prizes remain hidden until the user decrypts.  
- **G2: Keep the journey minimal** – Connect wallet → draw → decrypt → review history.

### 3. Scope

The game includes:

- Single loot pool (SSR / SR / R)  
- FHEVM-based encrypted draw and decrypt flow  
- Home page and Game page  
- Dark Baroque visual style, English-only copy  

### 4. Prize & Probability

- **Rarity & probabilities**:
  - 1% – SSR  
  - 9% – SR  
  - 90% – R  

- **Requirements**:
  - Probabilities encoded in the contract and easy to audit.  
  - Clear mapping from rarity tier to frontend visuals.  

### 5. Core FHE / FHEVM Requirements

- **F1: Ciphertext computation**  
  - Randomness and prize selection run in FHEVM over encrypted values only.  

- **F2: Result privacy**  
  - Until decrypt, no one (including developers) can see the prize.  

- **F3: Verifiable rules**  
  - Logic and distribution live in the contract and can be reviewed by anyone.  

### 6. IA & Pages

#### 6.1 Home

- Goal: Explain Cipher Loot, why it is encrypted, and how to try it.  
- Content:
  - Title and subtitle (Cipher Loot / Encrypted Loot Box on Sepolia).  
  - Three bullets: encrypted draws, verifiable rules, persistent history.  
  - CTA: “Enter Game”.  

#### 6.2 Game

- Modules:
  - Wallet & Network  
  - Draw  
  - Decrypt / Collection  
  - History  

### 7. Functional Requirements

#### 7.1 Wallet & Network

- Support mainstream EVM wallets (MetaMask etc.).  
- On Game load, detect current network and prompt to switch to Sepolia when needed.  
- Show connected address in short form.  

#### 7.2 Draw

- Primary button: “⚔ Draw Encrypted Loot”.  
- Clicking triggers a Sepolia transaction and shows an in-progress state.  
- Contract:
  - Computes encrypted randomness.  
  - Maps to SSR / SR / R with fixed probabilities.  
  - Stores encrypted result with timestamp.  

#### 7.3 Decrypt

- After confirmation, each encrypted entry has a “Decrypt” control.  
- Clicking triggers an EIP‑712 + Relayer-based decrypt.  
- On success: show rarity + card description.  

#### 7.4 History

- Collection / History section shows: time, rarity (if decrypted), state, TX hash.  

### 8. User Flows

1. Open Home → click “Enter Game”.  
2. Connect wallet & switch to Sepolia.  
3. Press “Draw Encrypted Loot” → confirm in wallet.  
4. After confirmation, see new entry in Collection.  
5. Click “Decrypt” → reveal rarity and card details.  
6. Return later and reload history by reconnecting the same wallet.  

### 9. Visual Requirements

- Dark / black background with Baroque accents.  
- Card styles differ by rarity (SSR most ornate, SR mid, R minimal).  
- Light, tasteful motion on draw / reveal.  

### 10. Technical Requirements

- Network: Sepolia Ethereum testnet.  
- Contract: FHEVM-based Solidity contract handling encrypted draws and history.  
- Frontend: Next.js + Tailwind + ethers + FHEVM JS SDK.  
- Data: Draw history stored on-chain and fetched per wallet.  


