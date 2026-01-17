import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../services/UserService';
import { FinancialUtils } from '../utils/FinancialUtils';

interface CreditEducationViewProps {
  userData: UserProfile;
}

export const CreditEducationView: React.FC<CreditEducationViewProps> = ({ userData }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'factors' | 'improvement' | 'benefits'>('factors');

  const creditScoreCategory = FinancialUtils.getCreditScoreCategory(userData.creditScore);
  const creditUtilization = FinancialUtils.calculateCreditUtilization(25000, 100000); // Mock data

  const handleLearnMore = (topic: string) => {
    Alert.alert('Learn More', `Detailed information about ${topic} will be available soon`);
  };

  const renderFactors = () => (
    <View>
      <Text style={styles.sectionTitle}>Credit Score Factors</Text>
      
      <View style={styles.factorItem}>
        <View style={styles.factorHeader}>
          <MaterialIcons name="payment" size={20} color="#10b981" />
          <Text style={styles.factorTitle}>Payment History (35%)</Text>
        </View>
        <Text style={styles.factorDescription}>
          Your track record of making payments on time. This is the most important factor affecting your credit score.
        </Text>
        <View style={styles.factorStatus}>
          <Text style={[styles.statusText, { color: '#10b981' }]}>✓ Excellent</Text>
        </View>
      </View>

      <View style={styles.factorItem}>
        <View style={styles.factorHeader}>
          <MaterialIcons name="account-balance" size={20} color="#f59e0b" />
          <Text style={styles.factorTitle}>Credit Utilization (30%)</Text>
        </View>
        <Text style={styles.factorDescription}>
          The percentage of available credit you're using. Keep it below 30% for optimal scores.
        </Text>
        <View style={styles.factorStatus}>
          <Text style={[styles.statusText, { color: '#f59e0b' }]}>⚠ {creditUtilization}% - Consider reducing</Text>
        </View>
      </View>

      <View style={styles.factorItem}>
        <View style={styles.factorHeader}>
          <MaterialIcons name="schedule" size={20} color="#10b981" />
          <Text style={styles.factorTitle}>Credit History Length (15%)</Text>
        </View>
        <Text style={styles.factorDescription}>
          How long you've had credit accounts. Longer history generally means better scores.
        </Text>
        <View style={styles.factorStatus}>
          <Text style={[styles.statusText, { color: '#10b981' }]}>✓ Good - {userData.account_age_months || 24} months</Text>
        </View>
      </View>

      <View style={styles.factorItem}>
        <View style={styles.factorHeader}>
          <MaterialIcons name="credit-card" size={20} color="#64748b" />
          <Text style={styles.factorTitle}>Credit Mix (10%)</Text>
        </View>
        <Text style={styles.factorDescription}>
          Having different types of credit accounts (credit cards, loans, mortgages).
        </Text>
        <View style={styles.factorStatus}>
          <Text style={[styles.statusText, { color: '#64748b' }]}>○ Average - Consider diversifying</Text>
        </View>
      </View>

      <View style={styles.factorItem}>
        <View style={styles.factorHeader}>
          <MaterialIcons name="new-releases" size={20} color="#10b981" />
          <Text style={styles.factorTitle}>New Credit (10%)</Text>
        </View>
        <Text style={styles.factorDescription}>
          Recent credit inquiries and newly opened accounts. Too many can temporarily lower your score.
        </Text>
        <View style={styles.factorStatus}>
          <Text style={[styles.statusText, { color: '#10b981' }]}>✓ Good - No recent inquiries</Text>
        </View>
      </View>
    </View>
  );

  const renderImprovement = () => (
    <View>
      <Text style={styles.sectionTitle}>Personalized Improvement Strategies</Text>
      
      <View style={styles.improvementCard}>
        <View style={styles.improvementHeader}>
          <MaterialIcons name="trending-up" size={24} color="#10b981" />
          <Text style={styles.improvementTitle}>Based on your profile, you should:</Text>
        </View>
        
        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>1.</Text>
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Reduce Credit Utilization</Text>
            <Text style={styles.recommendationDescription}>
              Based on your current utilization of {creditUtilization}%, paying down ₹15,000 would improve your score by 20-30 points.
            </Text>
          </View>
        </View>

        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>2.</Text>
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Set Up Automatic Payments</Text>
            <Text style={styles.recommendationDescription}>
              Based on your income of ₹{userData.monthlyIncome?.toLocaleString()}, you can afford to pay all bills automatically to maintain perfect payment history.
            </Text>
          </View>
        </View>

        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>3.</Text>
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Consider a Personal Loan</Text>
            <Text style={styles.recommendationDescription}>
              Based on your transaction history, a small personal loan paid off quickly could improve your credit mix.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Expected Improvement Timeline</Text>
        <View style={styles.timelineItem}>
          <Text style={styles.timelineMonth}>1-2 Months</Text>
          <Text style={styles.timelineAction}>Reduce utilization → +20-30 points</Text>
        </View>
        <View style={styles.timelineItem}>
          <Text style={styles.timelineMonth}>3-6 Months</Text>
          <Text style={styles.timelineAction}>Consistent payments → +10-15 points</Text>
        </View>
        <View style={styles.timelineItem}>
          <Text style={styles.timelineMonth}>6-12 Months</Text>
          <Text style={styles.timelineAction}>Improved credit mix → +5-10 points</Text>
        </View>
      </View>
    </View>
  );

  const renderBenefits = () => (
    <View>
      <Text style={styles.sectionTitle}>Financial Inclusion Benefits</Text>
      
      <View style={styles.benefitCard}>
        <MaterialIcons name="local-offer" size={24} color="#10b981" />
        <Text style={styles.benefitTitle}>Better Loan Terms</Text>
        <Text style={styles.benefitDescription}>
          With your current score of {userData.creditScore}, you qualify for premium rates. Improving to 800+ could save you ₹50,000+ on a home loan.
        </Text>
      </View>

      <View style={styles.benefitCard}>
        <MaterialIcons name="credit-card" size={24} color="#3b82f6" />
        <Text style={styles.benefitTitle}>Premium Credit Cards</Text>
        <Text style={styles.benefitDescription}>
          Access to cards with higher limits, better rewards, and exclusive benefits. Your profile qualifies for platinum tier cards.
        </Text>
      </View>

      <View style={styles.benefitCard}>
        <MaterialIcons name="home" size={24} color="#8b5cf6" />
        <Text style={styles.benefitTitle}>Housing Opportunities</Text>
        <Text style={styles.benefitDescription}>
          Better rental approvals and mortgage pre-approvals. Landlords and lenders prefer tenants/borrowers with scores above 750.
        </Text>
      </View>

      <View style={styles.benefitCard}>
        <MaterialIcons name="business" size={24} color="#f59e0b" />
        <Text style={styles.benefitTitle}>Business Financing</Text>
        <Text style={styles.benefitDescription}>
          Your personal credit score affects business loan eligibility. A strong score opens doors to entrepreneurial opportunities.
        </Text>
      </View>

      <Pressable 
        style={styles.actionButton}
        onPress={() => handleLearnMore('Financial Products')}
      >
        <Text style={styles.actionButtonText}>Explore Available Products</Text>
        <MaterialIcons name="arrow-forward" size={16} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Current Score Overview */}
      <View style={styles.scoreOverview}>
        <Text style={styles.scoreLabel}>Your Credit Score</Text>
        <Text style={styles.scoreValue}>{userData.creditScore}</Text>
        <Text style={styles.scoreCategory}>{creditScoreCategory}</Text>
        <View style={styles.scoreBar}>
          <View 
            style={[
              styles.scoreProgress, 
              { width: `${(userData.creditScore / 900) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.scoreRange}>300 - 900</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, selectedTab === 'factors' && styles.activeTab]}
          onPress={() => setSelectedTab('factors')}
        >
          <Text style={[styles.tabText, selectedTab === 'factors' && styles.activeTabText]}>
            Factors
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === 'improvement' && styles.activeTab]}
          onPress={() => setSelectedTab('improvement')}
        >
          <Text style={[styles.tabText, selectedTab === 'improvement' && styles.activeTabText]}>
            Improvement
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === 'benefits' && styles.activeTab]}
          onPress={() => setSelectedTab('benefits')}
        >
          <Text style={[styles.tabText, selectedTab === 'benefits' && styles.activeTabText]}>
            Benefits
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {selectedTab === 'factors' && renderFactors()}
        {selectedTab === 'improvement' && renderImprovement()}
        {selectedTab === 'benefits' && renderBenefits()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoreOverview: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  scoreCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 16,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  scoreRange: {
    fontSize: 12,
    color: '#94a3b8',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0f172a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  factorItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  factorDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  factorStatus: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  improvementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  improvementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginRight: 12,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  timelineMonth: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  timelineAction: {
    fontSize: 13,
    color: '#0f172a',
  },
  benefitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
});