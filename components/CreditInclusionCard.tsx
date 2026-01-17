import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CreditInclusionCardProps {
  alternativeCreditScore: number;
  financialStabilityIndex: number;
  loanReadinessScore: number;
  creditBuilderProgress: number;
}

export const CreditInclusionCard: React.FC<CreditInclusionCardProps> = ({
  alternativeCreditScore,
  financialStabilityIndex,
  loanReadinessScore,
  creditBuilderProgress,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-balance" size={24} color="#059669" />
        <Text style={styles.title}>Credit & Inclusion</Text>
      </View>

      <View style={styles.grid}>
        {/* Alternative Credit Score */}
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Alternative Credit</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(alternativeCreditScore) }]}>
            {alternativeCreditScore}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${alternativeCreditScore}%`,
                  backgroundColor: getScoreColor(alternativeCreditScore),
                },
              ]}
            />
          </View>
        </View>

        {/* Financial Stability Index */}
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Financial Stability</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(financialStabilityIndex) }]}>
            {financialStabilityIndex}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${financialStabilityIndex}%`,
                  backgroundColor: getScoreColor(financialStabilityIndex),
                },
              ]}
            />
          </View>
        </View>

        {/* Loan Readiness Score */}
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Loan Readiness</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(loanReadinessScore) }]}>
            {loanReadinessScore}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${loanReadinessScore}%`,
                  backgroundColor: getScoreColor(loanReadinessScore),
                },
              ]}
            />
          </View>
        </View>

        {/* Credit Builder Program */}
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Credit Builder</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(creditBuilderProgress) }]}>
            {creditBuilderProgress}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${creditBuilderProgress}%`,
                  backgroundColor: getScoreColor(creditBuilderProgress),
                },
              ]}
            />
          </View>
        </View>
      </View>

      <Pressable style={styles.learnMoreButton}>
        <Text style={styles.learnMoreText}>Learn More</Text>
        <MaterialIcons name="arrow-forward" size={16} color="#059669" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  scoreItem: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  learnMoreText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#059669',
  },
});
