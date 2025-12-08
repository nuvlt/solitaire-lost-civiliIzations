import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { PlayerProgress, Fragment } from '../types/fragments';
import { FragmentSystem } from '../game/FragmentSystem';
import { COLORS } from '../constants/colors';

interface CollectionScreenProps {
  progress: PlayerProgress;
  onCraftArtifact: (rarity: 'common' | 'rare' | 'epic' | 'legendary') => void;
  onBack: () => void;
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  progress,
  onCraftArtifact,
  onBack,
}) => {
  const artifactProgress = FragmentSystem.getArtifactProgress(progress.fragments);

  const renderFragmentsByRarity = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    const fragments = progress.fragments.filter(f => f.rarity === rarity);
    const { current, required } = artifactProgress[rarity];
    const canCraft = current >= required;
    const rarityColor = FragmentSystem.getRarityColor(rarity);

    return (
      <View key={rarity} style={[styles.raritySection, { borderColor: rarityColor }]}>
        <View style={styles.rarityHeader}>
          <Text style={[styles.rarityTitle, { color: rarityColor }]}>
            {rarity.toUpperCase()}
          </Text>
          <Text style={styles.progressText}>
            {current} / {required}
          </Text>
        </View>

        {/* Fragment Icons */}
        <View style={styles.fragmentGrid}>
          {fragments.slice(0, required).map((frag, idx) => (
            <View key={frag.id} style={styles.fragmentItem}>
              <Text style={styles.fragmentIcon}>{frag.icon}</Text>
            </View>
          ))}
          {Array.from({ length: required - fragments.length }).map((_, idx) => (
            <View key={`empty-${idx}`} style={[styles.fragmentItem, styles.emptySlot]}>
              <Text style={styles.emptyText}>?</Text>
            </View>
          ))}
        </View>

        {/* Craft Button */}
        {canCraft && (
          <TouchableOpacity
            style={[styles.craftButton, { backgroundColor: rarityColor }]}
            onPress={() => onCraftArtifact(rarity)}
          >
            <Text style={styles.craftButtonText}>⚒️ Craft Artifact</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏛️ Collection</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Fragments</Text>
            <Text style={styles.statValue}>{progress.fragments.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Artifacts</Text>
            <Text style={styles.statValue}>{progress.artifacts.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Games Won</Text>
            <Text style={styles.statValue}>{progress.totalGamesWon}</Text>
          </View>
        </View>

        {/* Completed Artifacts */}
        {progress.artifacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Completed Artifacts</Text>
            {progress.artifacts.map(artifact => (
              <View key={artifact.id} style={styles.artifactCard}>
                <Text style={styles.artifactIcon}>{artifact.icon}</Text>
                <View style={styles.artifactInfo}>
                  <Text style={styles.artifactName}>{artifact.name}</Text>
                  <Text style={styles.artifactDescription}>{artifact.description}</Text>
                  <Text style={[styles.artifactEffect, { color: FragmentSystem.getRarityColor(artifact.rarity) }]}>
                    {artifact.effect}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Fragment Collection by Rarity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔮 Fragment Collection</Text>
          {renderFragmentsByRarity('legendary')}
          {renderFragmentsByRarity('epic')}
          {renderFragmentsByRarity('rare')}
          {renderFragmentsByRarity('common')}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statLabel: {
    color: COLORS.text.secondary,
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  artifactCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  artifactIcon: {
    fontSize: 50,
    marginRight: 15,
  },
  artifactInfo: {
    flex: 1,
  },
  artifactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  artifactDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginBottom: 6,
  },
  artifactEffect: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  raritySection: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
  },
  rarityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rarityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  fragmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  fragmentItem: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emptySlot: {
    opacity: 0.3,
  },
  fragmentIcon: {
    fontSize: 28,
  },
  emptyText: {
    fontSize: 20,
    color: COLORS.text.disabled,
  },
  craftButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.highlight,
  },
  craftButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
