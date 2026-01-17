import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../services/UserService';
import { FinancialUtils, SIPResult } from '../utils/FinancialUtils';

interface InvestmentGuidanceProps {
  userData: UserProfile;
  onClose: () => void;
}

interface InvestmentRecommendation {
  id: string;
  schemeName: string;
  category: 'equity' | 'debt' | 'hybrid';
  riskLevel: 'low' | 'moderate' | 'high';
  expectedReturn: number;
  minimumInvestment: number;
  recommendationReason: string;
  suitabilityScore: number;
}

export const InvestmentGuidance: React.FC<InvestmentGuidanceProps> = ({ userData, onClose }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'recommendations' | 'sip' | 'portfolio'>('recommendations');
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);

  const surplus = userData.monthlyIncome - userData.monthlyExpenses;
  const suggestedSIP = FinancialUtils.suggestOptimalSIP(
    userData.monthlyIncome, 
    userData.monthlyExpenses, 
    userData.riskTolerance
  );

  const getPersonalizedRecommendations = (): InvestmentRecommendation[] => {
    const recommendations: InvestmentRecommendation[] = [];
    
    // Based on credit score and income
    if (userData.creditScore >= 750 && userData.monthlyIncome >= 50000) {
      recommendations.push({
        id: '1',
        schemeName: 'Large Cap Equity Fund',
        category: 'equity',
        riskLevel: 'moderate',
        expectedReturn: 12,
        minimumInvestment: 1000,
        recommendationReason: `Based on your excellent credit score of ${userData.creditScore} and stable income of ₹${userData.monthlyIncome.toLocaleString()}, you qualify for premium equity funds with lower expense ratios.`,
        suitabilityScore: 95
      });
      recommendations.push({
        id: '6',
        schemeName: 'Multi-Cap Growth Fund',
        category: 'equity',
        riskLevel: 'moderate',
        expectedReturn: 13,
        minimumInvestment: 1500,
        recommendationReason: `Your high credit score indicates good financial discipline. Multi-cap funds provide exposure to companies of all sizes for balanced growth.`,
        suitabilityScore: 92
      });
    }

    // Based on risk tolerance
    if (userData.riskTolerance === 'conservative') {
      recommendations.push({
        id: '2',
        schemeName: 'Debt Fund - Short Duration',
        category: 'debt',
        riskLevel: 'low',
        expectedReturn: 7,
        minimumInvestment: 1000,
        recommendationReason: `Based on your conservative risk profile and transaction history showing preference for stable returns, debt funds align with your investment style.`,
        suitabilityScore: 90
      });
      recommendations.push({
        id: '7',
        schemeName: 'Corporate Bond Fund',
        category: 'debt',
        riskLevel: 'low',
        expectedReturn: 8,
        minimumInvestment: 2000,
        recommendationReason: `Corporate bonds offer slightly higher returns than government securities while maintaining low risk suitable for conservative investors.`,
        suitabilityScore: 88
      });
    } else if (userData.riskTolerance === 'aggressive') {
      recommendations.push({
        id: '3',
        schemeName: 'Small Cap Growth Fund',
        category: 'equity',
        riskLevel: 'high',
        expectedReturn: 15,
        minimumInvestment: 2000,
        recommendationReason: `Based on your aggressive risk tolerance and young age profile, small cap funds can provide higher growth potential for long-term wealth creation.`,
        suitabilityScore: 88
      });
      recommendations.push({
        id: '8',
        schemeName: 'Sectoral Technology Fund',
        category: 'equity',
        riskLevel: 'high',
        expectedReturn: 16,
        minimumInvestment: 3000,
        recommendationReason: `Technology sector funds offer high growth potential for aggressive investors willing to accept higher volatility.`,
        suitabilityScore: 85
      });
    }

    // Based on surplus amount
    if (surplus > 20000) {
      recommendations.push({
        id: '4',
        schemeName: 'Balanced Hybrid Fund',
        category: 'hybrid',
        riskLevel: 'moderate',
        expectedReturn: 10,
        minimumInvestment: 1500,
        recommendationReason: `Based on your monthly surplus of ₹${surplus.toLocaleString()}, hybrid funds provide balanced exposure to equity and debt, suitable for wealth accumulation.`,
        suitabilityScore: 85
      });
      recommendations.push({
        id: '9',
        schemeName: 'International Equity Fund',
        category: 'equity',
        riskLevel: 'moderate',
        expectedReturn: 11,
        minimumInvestment: 2500,
        recommendationReason: `With substantial surplus, international funds provide geographical diversification and exposure to global markets.`,
        suitabilityScore: 83
      });
    }

    // Tax saving recommendation
    recommendations.push({
      id: '5',
      schemeName: 'ELSS Tax Saver Fund',
      category: 'equity',
      riskLevel: 'moderate',
      expectedReturn: 13,
      minimumInvestment: 500,
      recommendationReason: `Based on your income tax bracket, ELSS funds provide dual benefit of tax saving under Section 80C and potential for higher returns compared to traditional tax-saving instruments.`,
      suitabilityScore: 92
    });

    // Additional recommendations based on age and goals
    recommendations.push({
      id: '10',
      schemeName: 'Index Fund - Nifty 50',
      category: 'equity',
      riskLevel: 'moderate',
      expectedReturn: 11,
      minimumInvestment: 1000,
      recommendationReason: `Low-cost index funds provide market returns with minimal expense ratios, suitable for long-term wealth building.`,
      suitabilityScore: 87
    });

    recommendations.push({
      id: '11',
      schemeName: 'Gold ETF',
      category: 'hybrid',
      riskLevel: 'low',
      expectedReturn: 8,
      minimumInvestment: 1000,
      recommendationReason: `Gold provides portfolio diversification and acts as a hedge against inflation and market volatility.`,
      suitabilityScore: 80
    });

    return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  };

  const calculateSIP = (): SIPResult => {
    return FinancialUtils.calculateSIP(sipAmount, 12, sipYears);
  };

  const handleInvestNow = (scheme: InvestmentRecommendation) => {
    Alert.alert(
      'Investment Guidance',
      `You've selected ${scheme.schemeName}. This feature will redirect you to the investment platform soon.`,
      [{ text: 'OK' }]
    );
  };

  const renderRecommendations = () => {
    const recommendations = getPersonalizedRecommendations();

    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Personalized Investment Recommendations</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your credit score ({userData.creditScore}), monthly income (₹{userData.monthlyIncome.toLocaleString()}), 
          risk tolerance ({userData.riskTolerance}), and transaction history
        </Text>

        {recommendations.map((rec) => (
          <View key={rec.id} style={styles.recommendationCard}>
            <View style={styles.recHeader}>
              <View style={styles.recTitleContainer}>
                <Text style={styles.recTitle}>{rec.schemeName}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(rec.category) }]}>
                  <Text style={styles.categoryText}>{rec.category.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.suitabilityScore}>
                <Text style={styles.scoreText}>{rec.suitabilityScore}%</Text>
                <Text style={styles.scoreLabel}>Match</Text>
              </View>
            </View>

            <View style={styles.recDetails}>
              <View style={styles.recMetric}>
                <MaterialIcons name="trending-up" size={16} color="#10b981" />
                <Text style={styles.metricText}>Expected Return: {rec.expectedReturn}% p.a.</Text>
              </View>
              <View style={styles.recMetric}>
                <MaterialIcons name="security" size={16} color={getRiskColor(rec.riskLevel)} />
                <Text style={styles.metricText}>Risk: {rec.riskLevel.charAt(0).toUpperCase() + rec.riskLevel.slice(1)}</Text>
              </View>
              <View style={styles.recMetric}>
                <MaterialIcons name="account-balance-wallet" size={16} color="#3b82f6" />
                <Text style={styles.metricText}>Min Investment: ₹{rec.minimumInvestment}</Text>
              </View>
            </View>

            <Text style={styles.recReason}>{rec.recommendationReason}</Text>

            <View style={styles.riskWarning}>
              <MaterialIcons name="warning" size={16} color="#f59e0b" />
              <Text style={styles.warningText}>
                {rec.riskLevel === 'high' 
                  ? 'High risk investments can lead to significant losses. Invest only if you can afford to lose the invested amount.'
                  : rec.riskLevel === 'moderate'
                  ? 'Moderate risk investments are subject to market volatility. Past performance does not guarantee future returns.'
                  : 'Low risk investments may not beat inflation over long term. Consider diversification across risk levels.'
                }
              </Text>
            </View>

            <Pressable 
              style={styles.investButton}
              onPress={() => handleInvestNow(rec)}
            >
              <Text style={styles.investButtonText}>Learn More & Invest</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#fff" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderSIPCalculator = () => {
    const sipResult = calculateSIP();

    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>SIP Calculator</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your surplus of ₹{surplus.toLocaleString()}/month, we suggest starting with ₹{suggestedSIP.toLocaleString()}
        </Text>

        {/* Input Controls */}
        <View style={styles.calculatorCard}>
          <Text style={styles.calculatorTitle}>Calculate Your SIP Returns</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Investment Amount</Text>
            <View style={styles.inputContainer}>
              <Pressable 
                style={styles.adjustButton}
                onPress={() => setSipAmount(Math.max(500, sipAmount - 500))}
              >
                <MaterialIcons name="remove" size={20} color="#64748b" />
              </Pressable>
              <Text style={styles.inputValue}>₹{sipAmount.toLocaleString()}</Text>
              <Pressable 
                style={styles.adjustButton}
                onPress={() => setSipAmount(sipAmount + 500)}
              >
                <MaterialIcons name="add" size={20} color="#64748b" />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Investment Period (Years)</Text>
            <View style={styles.inputContainer}>
              <Pressable 
                style={styles.adjustButton}
                onPress={() => setSipYears(Math.max(1, sipYears - 1))}
              >
                <MaterialIcons name="remove" size={20} color="#64748b" />
              </Pressable>
              <Text style={styles.inputValue}>{sipYears} years</Text>
              <Pressable 
                style={styles.adjustButton}
                onPress={() => setSipYears(sipYears + 1)}
              >
                <MaterialIcons name="add" size={20} color="#64748b" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Projected Returns (12% p.a.)</Text>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Total Investment</Text>
            <Text style={styles.resultValue}>{FinancialUtils.formatCurrency(sipResult.totalInvestment)}</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Expected Returns</Text>
            <Text style={[styles.resultValue, { color: '#10b981' }]}>
              {FinancialUtils.formatCurrency(sipResult.expectedReturns)}
            </Text>
          </View>
          
          <View style={[styles.resultItem, styles.totalResult]}>
            <Text style={styles.totalLabel}>Maturity Amount</Text>
            <Text style={styles.totalValue}>{FinancialUtils.formatCurrency(sipResult.maturityAmount)}</Text>
          </View>
        </View>

        {/* Yearly Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Yearly Breakdown</Text>
          {sipResult.yearlyBreakdown.slice(0, 5).map((year) => (
            <View key={year.year} style={styles.breakdownItem}>
              <Text style={styles.breakdownYear}>Year {year.year}</Text>
              <View style={styles.breakdownValues}>
                <Text style={styles.breakdownInvested}>₹{(year.invested / 100000).toFixed(1)}L</Text>
                <Text style={styles.breakdownValue}>₹{(year.value / 100000).toFixed(1)}L</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderPortfolio = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Investment Portfolio Guidance</Text>
      
      {/* Asset Allocation */}
      <View style={styles.allocationCard}>
        <Text style={styles.allocationTitle}>Recommended Asset Allocation</Text>
        <Text style={styles.allocationSubtitle}>Based on your risk profile: {userData.riskTolerance}</Text>
        
        {userData.riskTolerance === 'conservative' && (
          <View style={styles.allocationBreakdown}>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '60%', backgroundColor: '#3b82f6' }]} />
              <Text style={styles.allocationText}>Debt Funds - 60%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '30%', backgroundColor: '#10b981' }]} />
              <Text style={styles.allocationText}>Equity Funds - 30%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '10%', backgroundColor: '#f59e0b' }]} />
              <Text style={styles.allocationText}>Gold/Commodities - 10%</Text>
            </View>
          </View>
        )}

        {userData.riskTolerance === 'moderate' && (
          <View style={styles.allocationBreakdown}>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '50%', backgroundColor: '#10b981' }]} />
              <Text style={styles.allocationText}>Equity Funds - 50%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '40%', backgroundColor: '#3b82f6' }]} />
              <Text style={styles.allocationText}>Debt Funds - 40%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '10%', backgroundColor: '#f59e0b' }]} />
              <Text style={styles.allocationText}>Gold/Commodities - 10%</Text>
            </View>
          </View>
        )}

        {userData.riskTolerance === 'aggressive' && (
          <View style={styles.allocationBreakdown}>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '70%', backgroundColor: '#10b981' }]} />
              <Text style={styles.allocationText}>Equity Funds - 70%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '20%', backgroundColor: '#3b82f6' }]} />
              <Text style={styles.allocationText}>Debt Funds - 20%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationBar, { width: '10%', backgroundColor: '#f59e0b' }]} />
              <Text style={styles.allocationText}>Gold/Commodities - 10%</Text>
            </View>
          </View>
        )}
      </View>

      {/* Investment Goals */}
      <View style={styles.goalsCard}>
        <Text style={styles.goalsTitle}>Investment Goals Tracking</Text>
        {userData.investmentGoals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <MaterialIcons name="flag" size={20} color="#8b5cf6" />
            <Text style={styles.goalText}>{goal.replace('_', ' ').toUpperCase()}</Text>
            <Text style={styles.goalStatus}>In Progress</Text>
          </View>
        ))}
      </View>

      {/* Diversification Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Diversification Tips</Text>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={16} color="#10b981" />
          <Text style={styles.tipText}>Don't put all money in one fund or sector</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={16} color="#10b981" />
          <Text style={styles.tipText}>Review and rebalance portfolio annually</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={16} color="#10b981" />
          <Text style={styles.tipText}>Consider international funds for global exposure</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={16} color="#10b981" />
          <Text style={styles.tipText}>Start SIP early to benefit from compounding</Text>
        </View>
      </View>
    </ScrollView>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'equity': return '#10b981';
      case 'debt': return '#3b82f6';
      case 'hybrid': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'moderate': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investment Guidance</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#64748b" />
        </Pressable>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, selectedTab === 'recommendations' && styles.activeTab]}
          onPress={() => setSelectedTab('recommendations')}
        >
          <Text style={[styles.tabText, selectedTab === 'recommendations' && styles.activeTabText]}>
            Recommendations
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === 'sip' && styles.activeTab]}
          onPress={() => setSelectedTab('sip')}
        >
          <Text style={[styles.tabText, selectedTab === 'sip' && styles.activeTabText]}>
            SIP Calculator
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === 'portfolio' && styles.activeTab]}
          onPress={() => setSelectedTab('portfolio')}
        >
          <Text style={[styles.tabText, selectedTab === 'portfolio' && styles.activeTabText]}>
            Portfolio
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      {selectedTab === 'recommendations' && renderRecommendations()}
      {selectedTab === 'sip' && renderSIPCalculator()}
      {selectedTab === 'portfolio' && renderPortfolio()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#0f172a',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  recommendationCard: {
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
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recTitleContainer: {
    flex: 1,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  suitabilityScore: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  recDetails: {
    marginBottom: 12,
  },
  recMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
  },
  recReason: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  riskWarning: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
    marginLeft: 6,
    flex: 1,
  },
  investButton: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  investButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  calculatorCard: {
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
  calculatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginHorizontal: 20,
    minWidth: 120,
    textAlign: 'center',
  },
  resultsCard: {
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
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  totalResult: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  breakdownYear: {
    fontSize: 14,
    color: '#64748b',
  },
  breakdownValues: {
    flexDirection: 'row',
    gap: 16,
  },
  breakdownInvested: {
    fontSize: 13,
    color: '#64748b',
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#10b981',
  },
  allocationCard: {
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
  allocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  allocationSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  allocationBreakdown: {
    gap: 12,
  },
  allocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allocationBar: {
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  allocationText: {
    fontSize: 14,
    color: '#0f172a',
  },
  goalsCard: {
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
  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 8,
    flex: 1,
  },
  goalStatus: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});