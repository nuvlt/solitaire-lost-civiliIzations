export const GAME_CONFIG = {
  // Card dimensions
  CARD_WIDTH: 70,
  CARD_HEIGHT: 100,
  CARD_RADIUS: 8,
  
  // Layout
  TABLEAU_SPACING: 10,
  PEAK_SPACING: 15,
  
  // Timing
  ANIMATION_DURATION: 300,
  PARTICLE_DURATION: 1000,
  
  // Fragments
  FRAGMENT_DROP_RATES: {
    WIN: {
      COMMON: 0.70,
      RARE: 0.22,
      EPIC: 0.07,
      LEGENDARY: 0.01,
    },
    LOSE: {
      COMMON: 0.40,
      RARE: 0.10,
      EPIC: 0,
      LEGENDARY: 0,
    },
  },
  
  // Artifact requirements
  ARTIFACT_FRAGMENTS: {
    COMMON: 5,
    RARE: 7,
    EPIC: 9,
    LEGENDARY: 12,
  },
};

export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
