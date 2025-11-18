import type { RarityKey } from '@/data/prizes';

export type DrawState = 'encrypted' | 'decrypting' | 'decrypted' | 'error';

export interface DrawEntry {
  drawId: number;
  timestamp: number;
  rarityHandle: string;
  variantHandle: string;
  rarity?: number;
  variant?: number;
  resolvedRarity?: any; // RarityMeta object
  state: DrawState;
  txHash?: string; // Transaction hash
}


