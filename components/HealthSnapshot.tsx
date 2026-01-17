import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HealthSnapshotProps {
  income: number;
  expenses: number;
  savings: number;
  emi: number;
}

export const HealthSnapshot: React.FC<HealthSnapshotProps> = ({
  income,
  expenses,
  savings,
  emi,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Health</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Income</Text>
          <Text style={styles.value}>₹{income.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Expenses</Text>
          <Text style={styles.value}>₹{expenses.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Savings</Text>
          <Text style={[styles.value, { color: '#10b981' }]}>
            ₹{savings.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>EMI Burden</Text>
          <Text style={[styles.value, { color: '#ef4444' }]}>
            ₹{Math.round(emi).toLocaleString('en-IN')}
          </Text>
        </View>
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
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: '47%',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 4,
  },
});
