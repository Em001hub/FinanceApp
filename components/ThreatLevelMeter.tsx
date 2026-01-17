import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical';

interface ThreatLevelMeterProps {
  level: ThreatLevel;
  factors: string[];
}

export const ThreatLevelMeter: React.FC<ThreatLevelMeterProps> = ({ level, factors }) => {
  const getThreatConfig = (threatLevel: ThreatLevel) => {
    switch (threatLevel) {
      case 'Low':
        return {
          color: '#10b981',
          bgColor: '#f0fdf4',
          percentage: 25,
          icon: 'check-circle' as const,
          message: 'Your account is secure',
        };
      case 'Medium':
        return {
          color: '#f59e0b',
          bgColor: '#fffbeb',
          percentage: 50,
          icon: 'warning' as const,
          message: 'Minor security concerns detected',
        };
      case 'High':
        return {
          color: '#f97316',
          bgColor: '#fff7ed',
          percentage: 75,
          icon: 'error-outline' as const,
          message: 'Immediate attention required',
        };
      case 'Critical':
        return {
          color: '#ef4444',
          bgColor: '#fef2f2',
          percentage: 100,
          icon: 'dangerous' as const,
          message: 'Critical security threat detected',
        };
    }
  };

  const config = getThreatConfig(level);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="security" size={24} color={config.color} />
        <Text style={styles.title}>Threat Level</Text>
      </View>

      {/* Circular Meter */}
      <View style={styles.meterContainer}>
        <View style={[styles.meterCircle, { borderColor: config.color }]}>
          <MaterialIcons name={config.icon} size={48} color={config.color} />
          <Text style={[styles.levelText, { color: config.color }]}>{level}</Text>
        </View>
      </View>

      {/* Horizontal Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${config.percentage}%`,
                backgroundColor: config.color,
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, level === 'Low' && { color: config.color }]}>
            Low
          </Text>
          <Text style={[styles.progressLabel, level === 'Medium' && { color: config.color }]}>
            Medium
          </Text>
          <Text style={[styles.progressLabel, level === 'High' && { color: config.color }]}>
            High
          </Text>
          <Text style={[styles.progressLabel, level === 'Critical' && { color: config.color }]}>
            Critical
          </Text>
        </View>
      </View>

      {/* Message */}
      <View style={[styles.messageContainer, { backgroundColor: config.bgColor }]}>
        <Text style={[styles.messageText, { color: config.color }]}>{config.message}</Text>
      </View>

      {/* Contributing Factors */}
      {factors.length > 0 && (
        <View style={styles.factorsContainer}>
          <Text style={styles.factorsTitle}>Contributing Factors:</Text>
          {factors.map((factor, index) => (
            <View key={index} style={styles.factorItem}>
              <View style={[styles.factorDot, { backgroundColor: config.color }]} />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  meterContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  meterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  factorsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  factorsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  factorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  factorText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
});
