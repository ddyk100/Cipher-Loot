export type RarityKey = 'R' | 'SR' | 'SSR';

export interface LootCard {
  id: number;
  name: string;
  codename: string;
  description: string;
  accent: string;
  background: string;
}

export interface RarityMeta {
  key: RarityKey;
  title: string;
  tagline: string;
  accent: string;
  border: string;
  probability: number;
  cards: LootCard[];
}

export const rarityByCode: Record<number, RarityKey> = {
  0: 'R',
  1: 'SR',
  2: 'SSR',
};

export const rarityMeta: Record<RarityKey, RarityMeta> = {
  SSR: {
    key: 'SSR',
    title: 'Singularity Relics',
    tagline: 'One percent chance. Fully encrypted brilliance.',
    accent: '#fcd34d',
    border: 'from-amber-200/80 via-orange-400/70 to-pink-500/60',
    probability: 1,
    cards: [
      {
        id: 0,
        name: 'Celestial Prism',
        codename: 'SSR-00',
        description: 'Refracts hostile signals into harmless auroras. Rumored to whisper the next winning strategy.',
        accent: '#fde047',
        background: 'radial-gradient(circle at 20% 20%, rgba(252,211,77,0.45), rgba(37,8,8,0.05))',
      },
      {
        id: 1,
        name: 'Chrono Bloom',
        codename: 'SSR-01',
        description: 'Suspends time for one encrypted heartbeat, letting strategists glimpse every branch of fate.',
        accent: '#fb923c',
        background: 'radial-gradient(circle at 80% 20%, rgba(251,146,60,0.45), rgba(6,4,23,0.05))',
      },
      {
        id: 2,
        name: 'Mythic Parallax',
        codename: 'SSR-02',
        description: 'A relic that mirrors your intent with perfect clarity. Favorite trophy of Sepolia speed-runners.',
        accent: '#f87171',
        background: 'radial-gradient(circle at 50% 80%, rgba(248,113,113,0.45), rgba(11,9,30,0.05))',
      },
    ],
  },
  SR: {
    key: 'SR',
    title: 'Spectrum Artifacts',
    tagline: 'Nine percent to pull a strat-shifting artifact.',
    accent: '#a5b4fc',
    border: 'from-indigo-300/70 via-sky-400/60 to-cyan-200/60',
    probability: 9,
    cards: [
      {
        id: 0,
        name: 'Aurora Edge',
        codename: 'SR-00',
        description: 'Slices through dark data fog, revealing a single encrypted insight.',
        accent: '#60a5fa',
        background: 'radial-gradient(circle at 10% 10%, rgba(96,165,250,0.35), rgba(8,27,41,0.05))',
      },
      {
        id: 1,
        name: 'Echo Crown',
        codename: 'SR-01',
        description: 'Stores three victorious calls and replays them when morale fades.',
        accent: '#818cf8',
        background: 'radial-gradient(circle at 70% 20%, rgba(129,140,248,0.35), rgba(17,17,43,0.05))',
      },
      {
        id: 2,
        name: 'Graviton Loom',
        codename: 'SR-02',
        description: 'Weaves defensive fields around fragile intel—perfect for secret raids.',
        accent: '#38bdf8',
        background: 'radial-gradient(circle at 30% 70%, rgba(56,189,248,0.35), rgba(5,18,31,0.05))',
      },
    ],
  },
  R: {
    key: 'R',
    title: 'Rogue Finds',
    tagline: 'Ninety percent odds, still encrypted treasures.',
    accent: '#93c5fd',
    border: 'from-slate-200/60 via-slate-500/50 to-slate-900/40',
    probability: 90,
    cards: [
      {
        id: 0,
        name: 'Rustlight Token',
        codename: 'R-00',
        description: 'Common chip traded across Cipher Loot taverns for tactical rumors.',
        accent: '#67e8f9',
        background: 'radial-gradient(circle at 85% 15%, rgba(103,232,249,0.3), rgba(8,20,32,0.05))',
      },
      {
        id: 1,
        name: 'Nightglass Charm',
        codename: 'R-01',
        description: 'Glows faintly when a decrypted message is authentic.',
        accent: '#c4b5fd',
        background: 'radial-gradient(circle at 40% 80%, rgba(196,181,253,0.3), rgba(16,16,32,0.05))',
      },
      {
        id: 2,
        name: 'Null Bloom',
        codename: 'R-02',
        description: 'Absorbs stray noise inside the vault, keeping re-encryption crisp.',
        accent: '#fca5a5',
        background: 'radial-gradient(circle at 25% 30%, rgba(252,165,165,0.3), rgba(26,11,23,0.05))',
      },
    ],
  },
};

export function resolveRarityMeta(code?: number) {
  if (code === undefined || code === null) return null;
  const key = rarityByCode[Number(code)] || 'R';
  return rarityMeta[key];
}

export function resolveLootCard(code?: number, variant?: number) {
  const base = resolveRarityMeta(code);
  if (!base) return null;
  const card = base.cards[variant ?? 0] || base.cards[0];
  return { rarity: base, card };
}


