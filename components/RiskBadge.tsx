import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RiskBadgeProps {
  level: 'Low' | 'Moderate' | 'High';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const getColor = () => {
    switch (level) {
      case 'High':
        return '#10b981';
      case 'Moderate':
        return '#f59e0b';
      case 'Low':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Risk Profile</Text>
      <View style={[styles.badge, { backgroundColor: getColor() }]}>
        <Text style={styles.badgeText}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
