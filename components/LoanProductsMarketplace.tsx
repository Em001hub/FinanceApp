import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface LoanProduct {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  interestRateMin: number;
  interestRateMax: number;
  maxAmount: number;
  tenureMin: number;
  tenureMax: number;
  gradient: [string, string];
}

interface LoanProductsMarketplaceProps {
  products: LoanProduct[];
  onCheckEligibility?: (productId: string) => void;
}

export const LoanProductsMarketplace: React.FC<LoanProductsMarketplaceProps> = ({
  products,
  onCheckEligibility,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="store" size={24} color="#10b981" />
        <Text style={styles.title}>Loan Products</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <LinearGradient
              colors={product.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientHeader}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name={product.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.productName}>{product.name}</Text>
            </LinearGradient>

            <View style={styles.productDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="percent" size={16} color="#64748b" />
                <Text style={styles.detailLabel}>Interest Rate</Text>
              </View>
              <Text style={styles.detailValue}>
                {product.interestRateMin}% - {product.interestRateMax}% p.a.
              </Text>

              <View style={[styles.detailRow, { marginTop: 12 }]}>
                <MaterialIcons name="account-balance-wallet" size={16} color="#64748b" />
                <Text style={styles.detailLabel}>Max Amount</Text>
              </View>
              <Text style={styles.detailValue}>
                ₹{(product.maxAmount / 100000).toFixed(1)}L
              </Text>

              <View style={[styles.detailRow, { marginTop: 12 }]}>
                <MaterialIcons name="schedule" size={16} color="#64748b" />
                <Text style={styles.detailLabel}>Tenure</Text>
              </View>
              <Text style={styles.detailValue}>
                {product.tenureMin}-{product.tenureMax} months
              </Text>

              <Pressable
                style={styles.checkButton}
                onPress={() => onCheckEligibility?.(product.id)}
              >
                <Text style={styles.checkButtonText}>Check Eligibility</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  productCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  gradientHeader: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  productDetails: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 6,
  },
  checkButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});
