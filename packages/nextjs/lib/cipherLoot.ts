export const SUPPORTED_CHAIN_ID = 11155111;

export const CONTRACT_ADDRESSES: Record<number, string> = {
  11155111: '0xc5A5FA28ed09eA41d979f545C0E7ADC9A8e2e68b', // Sepolia
  31337: '0x0000000000000000000000000000000000000000', // Local (placeholder)
};

export const SEPOLIA_NETWORK_CONFIG = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia Ethereum',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/xeMfJRSGpIGq5WiFz-bEiHoG6DGrZnAr'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
};

export const CIPHER_LOOT_ABI = [
  {
    inputs: [],
    name: 'InvalidDrawId',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'drawId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'rarityHandle',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'variantHandle',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'timestamp',
        type: 'uint64',
      },
    ],
    name: 'LootDrawn',
    type: 'event',
  },
  {
    inputs: [],
    name: 'confidentialProtocolId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'draw',
    outputs: [
      {
        internalType: 'uint256',
        name: 'drawId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
    ],
    name: 'getDrawCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'offset',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'limit',
        type: 'uint256',
      },
    ],
    name: 'getEncryptedHistory',
    outputs: [
      {
        internalType: 'bytes32[]',
        name: 'rarities',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: 'variants',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint64[]',
        name: 'timestamps',
        type: 'uint64[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'drawId',
        type: 'uint256',
      },
    ],
    name: 'getEncryptedResult',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'rarity',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'variant',
        type: 'bytes32',
      },
      {
        internalType: 'uint64',
        name: 'timestamp',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
    ],
    name: 'getLatestEncryptedResult',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'rarity',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'variant',
        type: 'bytes32',
      },
      {
        internalType: 'uint64',
        name: 'timestamp',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'drawId',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getProbabilityConfig',
    outputs: [
      {
        internalType: 'uint16',
        name: 'precision',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'srCutoff',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'ssrCutoff',
        type: 'uint16',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDraws',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export type CipherLootAbi = typeof CIPHER_LOOT_ABI;

export function getContractAddress(chainId?: number): string {
  if (chainId && CONTRACT_ADDRESSES[chainId]) {
    return CONTRACT_ADDRESSES[chainId];
  }
  return CONTRACT_ADDRESSES[SUPPORTED_CHAIN_ID] || '';
}

export function shortAddress(address?: string | null) {
  if (!address) return '—';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}


