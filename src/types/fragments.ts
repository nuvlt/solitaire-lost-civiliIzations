export type FragmentRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Fragment {
  id: string;
  rarity: FragmentRarity;
  name: string;
  description: string;
  icon: string; // Emoji for now
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: FragmentRarity;
  requiredFragments: number;
  currentFragments: number;
  icon: string;
  effect?: string; // e.g., "+5% coins", "Daily free undo"
  isCompleted: boolean;
}

export interface PlayerProgress {
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalScore: number;
  fragments: Fragment[];
  artifacts: Artifact[];
  currentStreak: number;
  bestStreak: number;
}

// Drop rates based on game document
export const DROP_RATES = {
  win: {
    common: 0.70,
    rare: 0.22,
    epic: 0.07,
    legendary: 0.01,
  },
  loss: {
    common: 0.40,
    rare: 0.10,
    epic: 0.0,
    legendary: 0.0,
  },
  streakBonus: 0.10, // +10% when streak >= 3
};

export const FRAGMENT_REQUIREMENTS = {
  common: 5,
  rare: 7,
  epic: 9,
  legendary: 12,
};
