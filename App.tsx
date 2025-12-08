import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameScreen } from './src/screens/GameScreen';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { StorageService } from './src/utils/storage';
import { FragmentSystem } from './src/game/FragmentSystem';
import { PlayerProgress } from './src/types/fragments';

type Screen = 'game' | 'collection';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('game');
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress = await StorageService.loadProgress();
    setPlayerProgress(progress);
  };

  const handleCraftArtifact = async (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    if (!playerProgress) return;

    try {
      const { updatedFragments, artifact } = FragmentSystem.completeArtifact(
        playerProgress.fragments,
        rarity
      );

      const updatedProgress: PlayerProgress = {
        ...playerProgress,
        fragments: updatedFragments,
        artifacts: [...playerProgress.artifacts, artifact],
      };

      setPlayerProgress(updatedProgress);
      await StorageService.saveProgress(updatedProgress);
    } catch (error) {
      console.error('Failed to craft artifact:', error);
    }
  };

  if (!playerProgress) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentScreen === 'game' ? (
        <GameScreen
          onShowCollection={() => setCurrentScreen('collection')}
          onProgressUpdate={setPlayerProgress}
        />
      ) : (
        <CollectionScreen
          progress={playerProgress}
          onCraftArtifact={handleCraftArtifact}
          onBack={() => setCurrentScreen('game')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
