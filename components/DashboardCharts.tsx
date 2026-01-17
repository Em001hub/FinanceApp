import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface DashboardChartsProps {
  income: number;
  expenses: number;
  savings: number;
  inclusionScore: number;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  income,
  expenses,
  savings,
  inclusionScore,
}) => {
  const generateScoreTrend = () => {
    const scores = [];
    for (let i = 0; i < 6; i++) {
      const variance = Math.random() * 10 - 5;
      const baseScore = inclusionScore - (5 - i) * 3;
      scores.push(Math.max(0, Math.min(100, baseScore + variance)));
    }
    return scores;
  };

  const scoreTrend = generateScoreTrend();
  const trendDirection = scoreTrend[5] > scoreTrend[0] ? 'up' : 'down';

  // Calculate percentages for visual bars
  const maxAmount = Math.max(income, expenses, savings);
  const incomePercent = (income / maxAmount) * 100;
  const expensesPercent = (expenses / maxAmount) * 100;
  const savingsPercent = (savings / maxAmount) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Monthly Financial Breakdown</Text>
        <Text style={styles.chartSubtitle}>Income, Expenses & Savings</Text>

        {/* Native Bar Chart Alternative */}
        <View style={styles.nativeBarChart}>
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}>Income</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: `${incomePercent}%`, backgroundColor: '#10b981' }]} />
            </View>
            <Text style={styles.barValue}>₹{income.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}>Expenses</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: `${expensesPercent}%`, backgroundColor: '#ef4444' }]} />
            </View>
            <Text style={styles.barValue}>₹{expenses.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}>Savings</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: `${savingsPercent}%`, backgroundColor: '#14b8a6' }]} />
            </View>
            <Text style={styles.barValue}>₹{savings.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <View style={styles.breakdown}>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.breakdownText}>Income: ₹{income.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.breakdownText}>Expenses: ₹{expenses.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#14b8a6' }]} />
            <Text style={styles.breakdownText}>
              Savings: ₹{savings.toLocaleString('en-IN')} ({((savings / income) * 100).toFixed(0)}%)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Financial Health Trend</Text>
        <Text style={styles.chartSubtitle}>Inclusion Score Progress (Last 6 Months)</Text>

        {/* Native Line Chart Alternative */}
        <View style={styles.nativeLineChart}>
          <View style={styles.trendContainer}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
              <View key={month} style={styles.trendPoint}>
                <View style={styles.trendBar}>
                  <View 
                    style={[
                      styles.trendBarFill, 
                      { height: `${scoreTrend[index]}%`, backgroundColor: '#10b981' }
                    ]} 
                  />
                </View>
                <Text style={styles.trendLabel}>{month}</Text>
                <Text style={styles.trendScore}>{Math.round(scoreTrend[index])}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.trendInfo}>
          <Text style={styles.trendText}>
            Your score is trending {trendDirection}
          </Text>
          <Text style={styles.trendSubtext}>Current Score: {inclusionScore}/100</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartWrapper: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  // Native Bar Chart Styles
  nativeBarChart: {
    marginVertical: 16,
    gap: 16,
  },
  barContainer: {
    gap: 6,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  barBackground: {
    height: 24,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
    minWidth: 2,
  },
  barValue: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'right',
  },
  // Native Line Chart Styles
  nativeLineChart: {
    marginVertical: 16,
    height: 180,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 8,
  },
  trendPoint: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  trendBar: {
    width: 20,
    height: 120,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 10,
    minHeight: 4,
  },
  trendLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  trendScore: {
    fontSize: 9,
    color: '#10b981',
    fontWeight: '600',
  },
  breakdown: {
    marginTop: 12,
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownText: {
    fontSize: 13,
    color: '#0f172a',
  },
  trendInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  trendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  trendSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
});
