import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerProgress } from '../types/fragments';

const STORAGE_KEY = '@solitaire_lost_civilizations:player_progress';

export class StorageService {
  /**
   * Load player progress from storage
   */
  static async loadProgress(): Promise<PlayerProgress> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }

    // Return default progress
    return {
      totalGamesPlayed: 0,
      totalGamesWon: 0,
      totalScore: 0,
      fragments: [],
      artifacts: [],
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  /**
   * Save player progress to storage
   */
  static async saveProgress(progress: PlayerProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  /**
   * Clear all data (for debugging)
   */
  static async clearProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }
}
