import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Card as CardComponent } from '../components/Card';
import { FragmentRewardModal } from '../components/FragmentRewardModal';
import { TriPeaksEngine } from '../game/TriPeaksEngine';
import { FragmentSystem } from '../game/FragmentSystem';
import { StorageService } from '../utils/storage';
import { GameState, Card as CardType } from '../types/game';
import { PlayerProgress, Fragment } from '../types/fragments';
import { COLORS } from '../constants/colors';
import { GAME_CONFIG } from '../constants/game';

interface GameScreenProps {
  onShowCollection: () => void;
  onProgressUpdate: (progress: PlayerProgress) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onShowCollection, onProgressUpdate }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | null>(null);
  const [showFragmentModal, setShowFragmentModal] = useState(false);
  const [rewardedFragment, setRewardedFragment] = useState<Fragment | null>(null);
  const [winStreak, setWinStreak] = useState(0);

  useEffect(() => {
    loadPlayerProgress();
  }, []);

  const loadPlayerProgress = async () => {
    const progress = await StorageService.loadProgress();
    setPlayerProgress(progress);
    startNewGame();
  };

  const saveProgress = async (progress: PlayerProgress) => {
    setPlayerProgress(progress);
    onProgressUpdate(progress);
    await StorageService.saveProgress(progress);
  };

  const startNewGame = () => {
    const deck = TriPeaksEngine.createDeck();
    const initialState = TriPeaksEngine.dealTriPeaks(deck);
    setGameState(initialState);
  };

  const handleCardPress = (card: CardType) => {
    if (!gameState || !playerProgress) return;

    const wasteTop = gameState.waste[gameState.waste.length - 1];
    
    if (!TriPeaksEngine.canPlayCard(card, wasteTop)) {
      Alert.alert('Invalid Move', 'Card must be one rank higher or lower!');
      return;
    }

    const newState = TriPeaksEngine.playCard(gameState, card);
    setGameState(newState);

    // Check win/lose conditions
    if (TriPeaksEngine.isGameWon(newState)) {
      setTimeout(() => {
        handleGameWin(newState);
      }, 300);
    } else if (TriPeaksEngine.isGameLost(newState)) {
      setTimeout(() => {
        handleGameLoss(newState);
      }, 300);
    }
  };

  const handleGameWin = (finalState: GameState) => {
    if (!playerProgress) return;

    const newStreak = winStreak + 1;
    setWinStreak(newStreak);

    // Roll for fragment
    const fragment = FragmentSystem.rollFragmentDrop(true, newStreak);

    // Update progress
    const updatedProgress: PlayerProgress = {
      ...playerProgress,
      totalGamesPlayed: playerProgress.totalGamesPlayed + 1,
      totalGamesWon: playerProgress.totalGamesWon + 1,
      totalScore: playerProgress.totalScore + finalState.score,
      fragments: fragment ? [...playerProgress.fragments, fragment] : playerProgress.fragments,
      currentStreak: newStreak,
      bestStreak: Math.max(newStreak, playerProgress.bestStreak),
    };

    saveProgress(updatedProgress);

    // Show fragment reward if dropped
    if (fragment) {
      setRewardedFragment(fragment);
      setShowFragmentModal(true);
    } else {
      Alert.alert(
        '🎉 Victory!',
        `You won!\nScore: ${finalState.score}\nMoves: ${finalState.moves}\nStreak: ${newStreak} 🔥`,
        [{ text: 'Continue', onPress: startNewGame }]
      );
    }
  };

  const handleGameLoss = (finalState: GameState) => {
    if (!playerProgress) return;

    setWinStreak(0);

    // Roll for fragment (lower rates for loss)
    const fragment = FragmentSystem.rollFragmentDrop(false, 0);

    // Update progress
    const updatedProgress: PlayerProgress = {
      ...playerProgress,
      totalGamesPlayed: playerProgress.totalGamesPlayed + 1,
      totalScore: playerProgress.totalScore + finalState.score,
      fragments: fragment ? [...playerProgress.fragments, fragment] : playerProgress.fragments,
      currentStreak: 0,
    };

    saveProgress(updatedProgress);

    if (fragment) {
      setRewardedFragment(fragment);
      setShowFragmentModal(true);
    } else {
      Alert.alert(
        '💀 Game Over',
        `No more moves!\nScore: ${finalState.score}`,
        [{ text: 'Try Again', onPress: startNewGame }]
      );
    }
  };

  const handleFragmentModalClose = () => {
    setShowFragmentModal(false);
    Alert.alert(
      gameState && TriPeaksEngine.isGameWon(gameState) ? '🎉 Victory!' : '💀 Game Over',
      gameState ? `Score: ${gameState.score}\nMoves: ${gameState.moves}` : '',
      [{ text: 'Continue', onPress: startNewGame }]
    );
  };

  const handleDrawCard = () => {
    if (!gameState) return;
    const newState = TriPeaksEngine.drawFromStock(gameState);
    setGameState(newState);

    if (TriPeaksEngine.isGameLost(newState)) {
      setTimeout(() => {
        handleGameLoss(newState);
      }, 300);
    }
  };

  if (!gameState || !playerProgress) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const playableCards = TriPeaksEngine.getPlayableCards(gameState.tableau);
  const wasteTop = gameState.waste[gameState.waste.length - 1];

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏛️ Lost Civilizations</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{gameState.score}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Moves</Text>
              <Text style={styles.statValue}>{gameState.moves}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>{gameState.streak}🔥</Text>
            </View>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              💎 Fragments: {playerProgress.fragments.length}
            </Text>
            <Text style={styles.progressText}>
              ✨ Artifacts: {playerProgress.artifacts.length}
            </Text>
          </View>
          <TouchableOpacity style={styles.collectionButton} onPress={onShowCollection}>
            <Text style={styles.collectionButtonText}>📖 Collection</Text>
          </TouchableOpacity>
        </View>

      {/* Tableau - TriPeaks Layout */}
      <View style={styles.tableau}>
        {gameState.tableau.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row, { marginTop: rowIndex * 30 }]}>
            {row.map((card, colIndex) => (
              <View key={card.id} style={[styles.cardContainer, { marginLeft: colIndex * 20 }]}>
                <CardComponent
                  card={card}
                  onPress={() => handleCardPress(card)}
                  isPlayable={
                    playableCards.some(c => c.id === card.id) &&
                    TriPeaksEngine.canPlayCard(card, wasteTop)
                  }
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Bottom Area - Stock & Waste */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.stockPile}
          onPress={handleDrawCard}
          disabled={gameState.stock.length === 0}
        >
          <View style={styles.stockCard}>
            {gameState.stock.length > 0 ? (
              <>
                <Text style={styles.stockText}>⚱</Text>
                <Text style={styles.stockCount}>{gameState.stock.length}</Text>
              </>
            ) : (
              <Text style={styles.stockEmpty}>✕</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.wastePile}>
          {wasteTop && <CardComponent card={wasteTop} />}
        </View>
      </View>

      {/* New Game Button */}
      <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
        <Text style={styles.newGameText}>🔄 New Game</Text>
      </TouchableOpacity>
    </ScrollView>

      {/* Fragment Reward Modal */}
      <FragmentRewardModal
        visible={showFragmentModal}
        fragment={rewardedFragment}
        onClose={handleFragmentModalClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  loading: {
    color: COLORS.text.primary,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: COLORS.secondary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  progressText: {
    color: COLORS.text.secondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  collectionButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: COLORS.highlight,
  },
  collectionButtonText: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statLabel: {
    color: COLORS.text.secondary,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  tableau: {
    alignItems: 'center',
    marginBottom: 40,
    minHeight: 400,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardContainer: {
    marginHorizontal: 2,
  },
  bottomArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 30,
  },
  stockPile: {
    width: 100,
    height: 140,
  },
  stockCard: {
    width: GAME_CONFIG.CARD_WIDTH,
    height: GAME_CONFIG.CARD_HEIGHT,
    backgroundColor: COLORS.primary,
    borderRadius: GAME_CONFIG.CARD_RADIUS,
    borderWidth: 2,
    borderColor: COLORS.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 40,
    color: COLORS.highlight,
  },
  stockCount: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: 'bold',
    marginTop: 5,
  },
  stockEmpty: {
    fontSize: 40,
    color: COLORS.text.disabled,
  },
  wastePile: {
    width: 100,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGameButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: COLORS.highlight,
  },
  newGameText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
