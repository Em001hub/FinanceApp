import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface InsightCardProps {
  user: any;
  inclusionScore: number;
  riskProfile: any;
  detectedEMI: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  user,
  inclusionScore,
  riskProfile,
  detectedEMI,
}) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    generateInsights();
  }, [inclusionScore]);

  const generateInsights = async () => {
    try {
      setLoading(true);
      
      // For demo: Generate fallback insights
      const savingsRate = ((user.monthly_savings / user.monthly_income) * 100).toFixed(0);
      const fallbackInsight = `Based on your income of ₹${user.monthly_income.toLocaleString(
        'en-IN'
      )} and savings of ₹${user.monthly_savings.toLocaleString(
        'en-IN'
      )}, you're saving ${savingsRate}% which is ${
        parseInt(savingsRate) >= 20 ? 'excellent' : 'good'
      }. Focus on maintaining consistent bill payments to improve your inclusion score of ${inclusionScore}.`;
      
      setInsights(fallbackInsight);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInsights = () => {
    generateInsights();
  };

  const handleCreditBuilder = () => {
    Alert.alert('Credit Builder', 'Credit building tools coming soon!');
  };

  const handleInvestmentGuide = () => {
    Alert.alert('Investment Guide', 'Investment guidance coming soon!');
  };

  const handleRegulationSimplifier = () => {
    Alert.alert('Regulation Simplifier', 'Regulation simplifier coming soon!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="lightbulb" size={20} color="#10b981" />
          <Text style={styles.headerText}>AI Financial Insights</Text>
        </View>
        <Pressable onPress={handleRefreshInsights} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={20} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#10b981" />
            <Text style={styles.loadingText}>Analyzing your finances...</Text>
          </View>
        ) : (
          <Text style={styles.text}>{insights}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={handleCreditBuilder}>
          <Text style={styles.btnText}>Credit Builder</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={handleInvestmentGuide}>
          <Text style={styles.btnText}>Investment Guide</Text>
        </Pressable>
        <Pressable style={styles.btnSecondary} onPress={handleRegulationSimplifier}>
          <Text style={styles.btnTextSecondary}>Regulation Simplifier</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  refreshButton: {
    padding: 4,
  },
  content: {
    marginBottom: 16,
    minHeight: 60,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 13,
  },
  text: {
    fontSize: 13,
    color: '#0f172a',
    lineHeight: 20,
  },
  actions: {
    gap: 8,
  },
  btn: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnTextSecondary: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 14,
  },
});
