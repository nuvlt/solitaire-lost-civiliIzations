export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  position: {
    row: number;
    col: number;
  };
}

export type FragmentRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Fragment {
  id: string;
  rarity: FragmentRarity;
  artifactType: string;
  image?: string;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: FragmentRarity;
  fragments: Fragment[];
  requiredFragments: number;
  completed: boolean;
  bonus?: {
    type: 'COIN' | 'FRAGMENT' | 'UNDO' | 'THEME';
    value: number | string;
  };
}

export interface GameState {
  tableau: Card[][];
  stock: Card[];
  waste: Card[];
  score: number;
  moves: number;
  streak: number;
  gameWon: boolean;
  gameLost: boolean;
}

export interface PlayerData {
  coins: number;
  fragments: Fragment[];
  artifacts: Artifact[];
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  currentStreak: number;
}
