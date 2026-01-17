import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../services/UserService';
import { FinancialUtils } from '../utils/FinancialUtils';

interface CreditBuilderProps {
  userData: UserProfile;
  onClose: () => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetScore: number;
  completed: boolean;
  reward: string;
}

export const CreditBuilder: React.FC<CreditBuilderProps> = ({ userData, onClose }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'tips' | 'progress' | 'milestones'>('tips');

  // Mock credit history for trend analysis
  const creditHistory = [
    { month: 'Jan', score: 720 },
    { month: 'Feb', score: 735 },
    { month: 'Mar', score: 745 },
    { month: 'Apr', score: 750 },
    { month: 'May', score: userData.creditScore }
  ];

  const trend = creditHistory[creditHistory.length - 1].score > creditHistory[0].score ? 'improving' : 
                creditHistory[creditHistory.length - 1].score < creditHistory[0].score ? 'declining' : 'stable';

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Credit Score 750+',
      description: 'Achieve excellent credit rating',
      targetScore: 750,
      completed: userData.creditScore >= 750,
      reward: 'Unlock premium credit cards'
    },
    {
      id: '2',
      title: 'Credit Score 800+',
      description: 'Join the elite credit club',
      targetScore: 800,
      completed: userData.creditScore >= 800,
      reward: 'Best loan interest rates'
    },
    {
      id: '3',
      title: 'Perfect Payment History',
      description: '12 months of on-time payments',
      targetScore: 0,
      completed: false,
      reward: 'Credit limit increase offers'
    }
  ];

  const getPersonalizedTips = () => {
    const tips = [];
    const currentScore = userData.creditScore;
    const monthlyIncome = userData.monthlyIncome;
    const monthlyExpenses = userData.monthlyExpenses;

    // Based on credit score
    if (currentScore < 650) {
      tips.push({
        title: 'Focus on Payment History',
        description: `Based on your current score of ${currentScore}, prioritize making all payments on time. This is the most important factor affecting your credit score.`,
        action: 'Set up automatic payments for all bills',
        impact: '+50-80 points in 6 months'
      });
      tips.push({
        title: 'Reduce Credit Card Debt',
        description: `High credit utilization is likely hurting your score. Focus on paying down existing debt before taking new credit.`,
        action: 'Pay minimum 50% of outstanding balances',
        impact: '+30-50 points in 3 months'
      });
    } else if (currentScore < 750) {
      tips.push({
        title: 'Reduce Credit Utilization',
        description: `Based on your score of ${currentScore}, reducing credit card usage below 30% will significantly boost your score.`,
        action: 'Pay down credit card balances',
        impact: '+20-40 points in 2-3 months'
      });
      tips.push({
        title: 'Increase Credit Limit',
        description: `Request credit limit increases on existing cards to improve your utilization ratio without changing spending habits.`,
        action: 'Contact banks for limit enhancement',
        impact: '+15-25 points in 1-2 months'
      });
    } else {
      tips.push({
        title: 'Maintain Excellence',
        description: `Based on your excellent score of ${currentScore}, focus on maintaining current habits while optimizing credit mix.`,
        action: 'Consider adding a small personal loan',
        impact: '+10-20 points in 6 months'
      });
      tips.push({
        title: 'Monitor Credit Report',
        description: `With your high score, focus on monitoring for any errors or fraudulent activities that could impact your rating.`,
        action: 'Check credit report monthly',
        impact: 'Maintain current excellent rating'
      });
    }

    // Based on income and expenses
    const surplus = monthlyIncome - monthlyExpenses;
    if (surplus > 10000) {
      tips.push({
        title: 'Accelerate Debt Payoff',
        description: `Based on your monthly surplus of ₹${surplus.toLocaleString()}, you can aggressively pay down high-interest debt.`,
        action: 'Pay extra ₹5,000 towards credit cards monthly',
        impact: 'Save ₹15,000+ in interest annually'
      });
      tips.push({
        title: 'Build Emergency Fund',
        description: `Use your surplus to build a 6-month emergency fund, which indirectly helps maintain good credit by avoiding debt during emergencies.`,
        action: 'Save ₹3,000 monthly in liquid funds',
        impact: 'Prevent future credit damage'
      });
    } else if (surplus > 5000) {
      tips.push({
        title: 'Strategic Debt Management',
        description: `With a moderate surplus of ₹${surplus.toLocaleString()}, focus on paying off highest interest debt first.`,
        action: 'Use debt avalanche method',
        impact: '+20-30 points in 4-6 months'
      });
    }

    // Based on transaction patterns (mock analysis)
    tips.push({
      title: 'Optimize Credit Mix',
      description: `Based on your transaction history showing regular income, you qualify for a credit builder loan at low interest.`,
      action: 'Apply for a small secured credit card',
      impact: '+15-25 points in 4-6 months'
    });

    tips.push({
      title: 'Improve Credit Age',
      description: `Keep your oldest credit accounts active with small purchases to maintain a longer credit history.`,
      action: 'Use oldest card for small monthly bills',
      impact: '+10-15 points over 12 months'
    });

    tips.push({
      title: 'Diversify Credit Types',
      description: `Having a mix of credit cards, loans, and other credit types can improve your score.`,
      action: 'Consider adding different credit products',
      impact: '+5-15 points in 6-12 months'
    });

    return tips;
  };

  const renderTips = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Personalized Credit Building Tips</Text>
      <Text style={styles.sectionSubtitle}>
        Based on your credit score of {userData.creditScore}, income of ₹{userData.monthlyIncome?.toLocaleString()}, and spending patterns
      </Text>

      {getPersonalizedTips().map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <MaterialIcons name="lightbulb" size={20} color="#f59e0b" />
            <Text style={styles.tipTitle}>{tip.title}</Text>
          </View>
          <Text style={styles.tipDescription}>{tip.description}</Text>
          <View style={styles.tipAction}>
            <Text style={styles.actionLabel}>Recommended Action:</Text>
            <Text style={styles.actionText}>{tip.action}</Text>
          </View>
          <View style={styles.tipImpact}>
            <MaterialIcons name="trending-up" size={16} color="#10b981" />
            <Text style={styles.impactText}>{tip.impact}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderProgress = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Your Credit Progress</Text>
      
      {/* Trend Analysis */}
      <View style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <MaterialIcons 
            name={trend === 'improving' ? 'trending-up' : trend === 'declining' ? 'trending-down' : 'trending-flat'} 
            size={24} 
            color={trend === 'improving' ? '#10b981' : trend === 'declining' ? '#ef4444' : '#64748b'} 
          />
          <Text style={styles.trendTitle}>
            Your credit score is {trend === 'improving' ? 'improving' : trend === 'declining' ? 'declining' : 'stable'}
          </Text>
        </View>
        
        <Text style={styles.trendDescription}>
          {trend === 'improving' 
            ? `Great job! Your score has increased by ${userData.creditScore - creditHistory[0].score} points over the last 5 months. Based on your consistent payment history and reduced credit utilization, you should continue this upward trend.`
            : trend === 'declining'
            ? `Your score has decreased by ${creditHistory[0].score - userData.creditScore} points. Based on your recent payment patterns, you should focus on making all payments on time and reducing credit card balances.`
            : `Your score has remained stable at around ${userData.creditScore}. Based on your current financial behavior, consider diversifying your credit mix to see improvement.`
          }
        </Text>

        {/* Score History Chart (simplified) */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>5-Month Score Trend</Text>
          <View style={styles.chartBars}>
            {creditHistory.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <View 
                  style={[
                    styles.chartBar, 
                    { height: (item.score / 900) * 100 }
                  ]} 
                />
                <Text style={styles.chartLabel}>{item.month}</Text>
                <Text style={styles.chartValue}>{item.score}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Pattern Analysis */}
      <View style={styles.patternCard}>
        <Text style={styles.patternTitle}>Based on your spending pattern, you should:</Text>
        <View style={styles.patternItem}>
          <MaterialIcons name="check-circle" size={16} color="#10b981" />
          <Text style={styles.patternText}>
            Continue your current payment discipline - you've made all payments on time
          </Text>
        </View>
        <View style={styles.patternItem}>
          <MaterialIcons name="warning" size={16} color="#f59e0b" />
          <Text style={styles.patternText}>
            Reduce credit utilization from current 45% to below 30% for optimal scoring
          </Text>
        </View>
        <View style={styles.patternItem}>
          <MaterialIcons name="info" size={16} color="#3b82f6" />
          <Text style={styles.patternText}>
            Consider a small personal loan to improve your credit mix diversity
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderMilestones = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Credit Milestones</Text>
      <Text style={styles.sectionSubtitle}>
        Achieve these milestones to unlock better financial opportunities
      </Text>

      {milestones.map((milestone) => (
        <View key={milestone.id} style={[styles.milestoneCard, milestone.completed && styles.completedMilestone]}>
          <View style={styles.milestoneHeader}>
            <MaterialIcons 
              name={milestone.completed ? 'check-circle' : 'radio-button-unchecked'} 
              size={24} 
              color={milestone.completed ? '#10b981' : '#94a3b8'} 
            />
            <View style={styles.milestoneContent}>
              <Text style={[styles.milestoneTitle, milestone.completed && styles.completedText]}>
                {milestone.title}
              </Text>
              <Text style={styles.milestoneDescription}>{milestone.description}</Text>
            </View>
          </View>
          
          {milestone.targetScore > 0 && (
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((userData.creditScore / milestone.targetScore) * 100, 100)}%` }
                ]} 
              />
            </View>
          )}
          
          <View style={styles.milestoneReward}>
            <MaterialIcons name="card-giftcard" size={16} color="#8b5cf6" />
            <Text style={styles.rewardText}>{milestone.reward}</Text>
          </View>
          
          {milestone.completed && (
            <View style={styles.celebrationBadge}>
              <Text style={styles.celebrationText}>🎉 Completed!</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Credit Builder</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#64748b" />
        </Pressable>
      </View>

      {/* Current Score Display */}
      <View style={styles.scoreDisplay}>
        <Text style={styles.scoreLabel}>Current Credit Score</Text>
        <Text style={styles.scoreValue}>{userData.creditScore}</Text>
        <Text style={styles.scoreCategory}>{FinancialUtils.getCreditScoreCategory(userData.creditScore)}</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, selectedTab === 'tips' && styles.activeTab]}
          onPress={() => setSelectedTab('tips')}
        >
          <Text style={[styles.tabText, selectedTab === 'tips' && styles.activeTabText]}>
            Tips
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === 'progress' && styles.activeTab]}
          onPress={() => setSelectedTab('progress')}
        >
          <Text style={[styles.tabText, selectedTab === 'progress' && styles.activeTabText]}>
            Progress
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === 'milestones' && styles.activeTab]}
          onPress={() => setSelectedTab('milestones')}
        >
          <Text style={[styles.tabText, selectedTab === 'milestones' && styles.activeTabText]}>
            Milestones
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      {selectedTab === 'tips' && renderTips()}
      {selectedTab === 'progress' && renderProgress()}
      {selectedTab === 'milestones' && renderMilestones()}
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
  scoreDisplay: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    marginHorizontal: 4,
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
  tipCard: {
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
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipAction: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#64748b',
  },
  tipImpact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#10b981',
    marginLeft: 4,
  },
  trendCard: {
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
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  trendDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 20,
  },
  chartContainer: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    backgroundColor: '#10b981',
    width: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0f172a',
  },
  patternCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patternText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  milestoneCard: {
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
  completedMilestone: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  milestoneContent: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  completedText: {
    color: '#10b981',
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  milestoneReward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 13,
    color: '#8b5cf6',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  celebrationBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  celebrationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
});