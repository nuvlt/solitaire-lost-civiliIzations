import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Fragment } from '../types/fragments';
import { FragmentSystem } from '../game/FragmentSystem';
import { COLORS } from '../constants/colors';

interface FragmentRewardModalProps {
  visible: boolean;
  fragment: Fragment | null;
  onClose: () => void;
}

export const FragmentRewardModal: React.FC<FragmentRewardModalProps> = ({
  visible,
  fragment,
  onClose,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  if (!fragment) return null;

  const rarityColor = FragmentSystem.getRarityColor(fragment.rarity);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Rarity Badge */}
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.rarityText}>{fragment.rarity.toUpperCase()}</Text>
          </View>

          {/* Fragment Icon */}
          <Text style={styles.icon}>{fragment.icon}</Text>

          {/* Fragment Info */}
          <Text style={styles.title}>Fragment Discovered!</Text>
          <Text style={styles.name}>{fragment.name}</Text>
          <Text style={styles.description}>{fragment.description}</Text>

          {/* Sparkle Effect */}
          <View style={styles.sparkleContainer}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: COLORS.primary,
    shadowColor: COLORS.highlight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  rarityBadge: {
    position: 'absolute',
    top: -15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.highlight,
  },
  rarityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  icon: {
    fontSize: 80,
    marginTop: 20,
    marginBottom: 10,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  sparkleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  sparkle: {
    fontSize: 30,
    opacity: 0.8,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.highlight,
  },
  buttonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
