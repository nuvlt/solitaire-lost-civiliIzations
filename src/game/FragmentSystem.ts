import { Fragment, Artifact, FragmentRarity, DROP_RATES, FRAGMENT_REQUIREMENTS } from '../types/fragments';

// Desert-themed fragments
const DESERT_FRAGMENTS = {
  common: [
    { name: 'Sand Grain', icon: '🏜️', description: 'Ancient desert sand' },
    { name: 'Pottery Shard', icon: '🏺', description: 'Broken ceramic piece' },
    { name: 'Stone Chip', icon: '🪨', description: 'Weathered stone fragment' },
  ],
  rare: [
    { name: 'Bronze Coin', icon: '🪙', description: 'Ancient currency' },
    { name: 'Hieroglyph Tablet', icon: '📜', description: 'Carved symbols' },
    { name: 'Golden Thread', icon: '✨', description: 'Royal textile remnant' },
  ],
  epic: [
    { name: 'Scarab Amulet', icon: '🪲', description: 'Sacred beetle charm' },
    { name: 'Pharaoh\'s Seal', icon: '💍', description: 'Royal signet' },
    { name: 'Obelisk Piece', icon: '🗿', description: 'Monument fragment' },
  ],
  legendary: [
    { name: 'Sun Stone', icon: '☀️', description: 'Radiant ancient relic' },
    { name: 'Ankh Key', icon: '⚱️', description: 'Symbol of eternal life' },
    { name: 'Crown Fragment', icon: '👑', description: 'Lost royal treasure' },
  ],
};

// Desert-themed artifacts
const DESERT_ARTIFACTS = [
  {
    id: 'sun-stone-tablet',
    name: 'Sun Stone Tablet',
    description: 'Grants bonus coins from victories',
    rarity: 'common' as FragmentRarity,
    icon: '☀️',
    effect: '+5% coins',
  },
  {
    id: 'moon-scarab',
    name: 'Moon Scarab',
    description: 'Increases fragment drop rate',
    rarity: 'rare' as FragmentRarity,
    icon: '🌙',
    effect: '+10% fragments',
  },
  {
    id: 'desert-wind-charm',
    name: 'Desert Wind Charm',
    description: 'Daily free undo',
    rarity: 'epic' as FragmentRarity,
    icon: '🌪️',
    effect: '1 free undo/day',
  },
  {
    id: 'lost-crown',
    name: 'Lost Crown of the Sands',
    description: 'Unlocks special desert theme',
    rarity: 'legendary' as FragmentRarity,
    icon: '👑',
    effect: 'Special theme',
  },
];

export class FragmentSystem {
  /**
   * Roll for fragment drop based on game result
   */
  static rollFragmentDrop(isWin: boolean, winStreak: number): Fragment | null {
    const rates = isWin ? DROP_RATES.win : DROP_RATES.loss;
    let totalBonus = 1.0;
    
    // Apply streak bonus
    if (winStreak >= 3) {
      totalBonus += DROP_RATES.streakBonus;
    }

    const roll = Math.random();
    let cumulative = 0;

    // Check legendary first
    cumulative += rates.legendary * totalBonus;
    if (roll < cumulative) {
      return this.generateFragment('legendary');
    }

    // Check epic
    cumulative += rates.epic * totalBonus;
    if (roll < cumulative) {
      return this.generateFragment('epic');
    }

    // Check rare
    cumulative += rates.rare * totalBonus;
    if (roll < cumulative) {
      return this.generateFragment('rare');
    }

    // Check common
    cumulative += rates.common * totalBonus;
    if (roll < cumulative) {
      return this.generateFragment('common');
    }

    return null; // No drop
  }

  /**
   * Generate a random fragment of given rarity
   */
  static generateFragment(rarity: FragmentRarity): Fragment {
    const pool = DESERT_FRAGMENTS[rarity];
    const template = pool[Math.floor(Math.random() * pool.length)];
    
    return {
      id: `${rarity}-${Date.now()}-${Math.random()}`,
      rarity,
      name: template.name,
      description: template.description,
      icon: template.icon,
    };
  }

  /**
   * Check if player can complete an artifact
   */
  static canCompleteArtifact(fragments: Fragment[], artifactRarity: FragmentRarity): boolean {
    const required = FRAGMENT_REQUIREMENTS[artifactRarity];
    const available = fragments.filter(f => f.rarity === artifactRarity).length;
    return available >= required;
  }

  /**
   * Complete an artifact (consumes fragments)
   */
  static completeArtifact(
    fragments: Fragment[],
    artifactRarity: FragmentRarity
  ): { updatedFragments: Fragment[]; artifact: Artifact } {
    const required = FRAGMENT_REQUIREMENTS[artifactRarity];
    const matchingFragments = fragments.filter(f => f.rarity === artifactRarity);
    
    if (matchingFragments.length < required) {
      throw new Error('Not enough fragments');
    }

    // Remove used fragments
    const usedFragmentIds = matchingFragments.slice(0, required).map(f => f.id);
    const updatedFragments = fragments.filter(f => !usedFragmentIds.includes(f.id));

    // Create artifact
    const artifactTemplate = DESERT_ARTIFACTS.find(a => a.rarity === artifactRarity)!;
    const artifact: Artifact = {
      ...artifactTemplate,
      requiredFragments: required,
      currentFragments: required,
      isCompleted: true,
    };

    return { updatedFragments, artifact };
  }

  /**
   * Get progress for all artifact types
   */
  static getArtifactProgress(fragments: Fragment[]): Record<FragmentRarity, { current: number; required: number }> {
    return {
      common: {
        current: fragments.filter(f => f.rarity === 'common').length,
        required: FRAGMENT_REQUIREMENTS.common,
      },
      rare: {
        current: fragments.filter(f => f.rarity === 'rare').length,
        required: FRAGMENT_REQUIREMENTS.rare,
      },
      epic: {
        current: fragments.filter(f => f.rarity === 'epic').length,
        required: FRAGMENT_REQUIREMENTS.epic,
      },
      legendary: {
        current: fragments.filter(f => f.rarity === 'legendary').length,
        required: FRAGMENT_REQUIREMENTS.legendary,
      },
    };
  }

  /**
   * Get rarity color
   */
  static getRarityColor(rarity: FragmentRarity): string {
    const colors = {
      common: '#9E9E9E',
      rare: '#2196F3',
      epic: '#9C27B0',
      legendary: '#FF9800',
    };
    return colors[rarity];
  }

  /**
   * Get next available artifact to craft
   */
  static getNextCraftableArtifact(fragments: Fragment[], completedArtifacts: Artifact[]): Artifact | null {
    const completedIds = completedArtifacts.map(a => a.id);
    const progress = this.getArtifactProgress(fragments);

    for (const artifactTemplate of DESERT_ARTIFACTS) {
      if (completedIds.includes(artifactTemplate.id)) continue;
      
      const { current, required } = progress[artifactTemplate.rarity];
      if (current >= required) {
        return {
          ...artifactTemplate,
          requiredFragments: required,
          currentFragments: current,
          isCompleted: false,
        };
      }
    }

    return null;
  }
}
