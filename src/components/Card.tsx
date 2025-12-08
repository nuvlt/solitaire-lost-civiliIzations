import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Card as CardType } from '../types/game';
import { COLORS } from '../constants/colors';
import { GAME_CONFIG } from '../constants/game';

interface CardProps {
  card: CardType;
  onPress?: () => void;
  disabled?: boolean;
  isPlayable?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onPress, disabled, isPlayable }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getSuitSymbol = (suit: CardType['suit']): string => {
    const symbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };
    return symbols[suit];
  };

  const getSuitColor = (suit: CardType['suit']): string => {
    return suit === 'hearts' || suit === 'diamonds' ? COLORS.hearts : COLORS.spades;
  };

  if (!card.faceUp) {
    return (
      <Animated.View 
        style={[
          styles.card, 
          styles.cardBack,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Text style={styles.backPattern}>⚱</Text>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !isPlayable}
      activeOpacity={0.8}
    >
      <Animated.View 
        style={[
          styles.card, 
          styles.cardFront,
          isPlayable && styles.playableCard,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Text style={[styles.rank, { color: getSuitColor(card.suit) }]}>
          {card.rank}
        </Text>
        <Text style={[styles.suit, { color: getSuitColor(card.suit) }]}>
          {getSuitSymbol(card.suit)}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: GAME_CONFIG.CARD_WIDTH,
    height: GAME_CONFIG.CARD_HEIGHT,
    borderRadius: GAME_CONFIG.CARD_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardBack: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.highlight,
  },
  cardFront: {
    backgroundColor: COLORS.cardFront,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  playableCard: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.6,
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 5,
    left: 8,
  },
  suit: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  backPattern: {
    fontSize: 40,
    color: COLORS.highlight,
    textShadowColor: COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
