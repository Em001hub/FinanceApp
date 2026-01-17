import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DashboardCharts } from '../components/DashboardCharts';
import { HealthSnapshot } from '../components/HealthSnapshot';
import { InsightCard } from '../components/InsightCard';
import { RiskBadge } from '../components/RiskBadge';
import { CreditInclusionCard } from '../components/CreditInclusionCard';
import { ActivityFeed, ActivityEvent } from '../components/ActivityFeed';
import { PersonalizedGreeting } from '../components/PersonalizedGreeting';
import { DetailedViewModal } from '../components/DetailedViewModal';
import { CreditBuilder } from '../components/CreditBuilder';
import { InvestmentGuidance } from '../components/InvestmentGuidance';
import { RegulationSimplified } from '../components/RegulationSimplified';
import { languageService } from '../services/LanguageService';
import { userService } from '../services/UserService';

// Mock user data
const mockUser = {
  monthly_income: 50000,
  monthly_savings: 15000,
  account_age_months: 24,
};

const mockRiskProfile = {
  level: 'High' as 'High' | 'Moderate' | 'Low',
  score: 75,
};

const mockDetectedEMI = 5000;

export default function DashboardScreen() {
  const { t } = useTranslation();
  const [inclusionScore] = useState(78);
  const [language, setLanguage] = useState('en');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'security' | 'credit' | 'activity' | 'risk' | 'investment'>('security');
  const [creditBuilderVisible, setCreditBuilderVisible] = useState(false);
  const [investmentGuidanceVisible, setInvestmentGuidanceVisible] = useState(false);
  const [regulationVisible, setRegulationVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(userService.getMockUserProfile());

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      await languageService.loadSavedLanguage();
      await userService.initializeMockData();
      setLanguage(languageService.currentLanguage);
      const profile = await userService.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Failed to initialize services:', error);
    }
  };

  const expenses = mockUser.monthly_income - mockUser.monthly_savings;

  // Mock activity feed data
  const [activityEvents] = useState<ActivityEvent[]>([
    {
      id: '1',
      type: 'fraud',
      title: 'Suspicious Transaction Blocked',
      description: 'High-risk transaction from unknown merchant flagged',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    },
    {
      id: '2',
      type: 'loan',
      title: 'Loan Application Approved',
      description: 'Your personal loan of ₹3,00,000 has been approved',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      type: 'credit',
      title: 'Credit Score Updated',
      description: 'Your credit score increased by 15 points',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: '4',
      type: 'compliance',
      title: 'KYC Verification Complete',
      description: 'Your identity verification has been successfully completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    },
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 17) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  const openModal = (type: 'security' | 'credit' | 'activity' | 'risk' | 'investment') => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleLanguage = async () => {
    const order = ['en', 'hi', 'te', 'ma', 'bn'];
    const idx = order.indexOf(language);
    const next = order[(idx + 1) % order.length];
    
    try {
      await languageService.changeLanguage(next);
      setLanguage(next);
      Alert.alert(t('common.success'), `Language set to ${next.toUpperCase()}`);
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to change language');
      console.error('Language change failed:', error);
    }
  };

  const handleCheckNumber = () => {
    if (!phoneNumber.trim()) {
      Alert.alert(t('common.error'), 'Please enter a phone number');
      return;
    }
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore > 60 ? 'SCAM' : riskScore > 30 ? 'SUSPICIOUS' : 'SAFE';
    const icon = riskLevel === 'SCAM' ? '🚨' : riskLevel === 'SUSPICIOUS' ? '⚠️' : '✅';
    Alert.alert('Scam Check Result', `${icon} Risk Level: ${riskLevel}\nRisk Score: ${riskScore}/100`);
  };

  const handleScanMessage = () => {
    if (!message.trim()) {
      Alert.alert(t('common.error'), 'Please paste a message to analyze');
      return;
    }
    const hasLinks = message.includes('http') || message.includes('www');
    const hasUrgency = /urgent|immediately|expire|block|suspend/i.test(message);
    const riskScore = (hasLinks ? 40 : 0) + (hasUrgency ? 30 : 0) + Math.floor(Math.random() * 30);
    const riskLevel = riskScore > 60 ? 'SCAM' : riskScore > 30 ? 'SUSPICIOUS' : 'SAFE';
    const icon = riskLevel === 'SCAM' ? '🚨' : riskLevel === 'SUSPICIOUS' ? '⚠️' : '✅';
    Alert.alert('Message Scan Result', `${icon} Risk Level: ${riskLevel}\nRisk Score: ${riskScore}/100`);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gradientHeader}>
          <SafeAreaView>
            <View style={styles.header}>
              <PersonalizedGreeting />
              <View style={styles.headerRight}>
                <Pressable style={styles.notificationButton}>
                  <MaterialIcons name="notifications-none" size={20} color="#64748b" />
                  <View style={styles.notificationDot} />
                </Pressable>
                <Pressable onPress={toggleLanguage} style={styles.langButton}>
                  <Text style={styles.langText}>{language.toUpperCase()}</Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </View>
        {/* Financial Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>{t('dashboard.financialOverview')}</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>{t('dashboard.inclusionScore')}</Text>
              <Text style={styles.overviewValue}>{inclusionScore}/100</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>{t('dashboard.riskProfile')}</Text>
              <Text style={[styles.overviewValue, { color: '#64748b' }]}>{mockRiskProfile.level}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>{t('dashboard.monthlySpend')}</Text>
              <Text style={styles.overviewValue}>₹{expenses.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>{t('dashboard.creditHealth')}</Text>
              <Text style={[styles.overviewValue, { color: '#64748b' }]}>750/900</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>{t('dashboard.savingsRatio')}</Text>
              <Text style={[styles.overviewValue, { color: '#64748b' }]}>30%</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>{t('dashboard.creditUtilization')}</Text>
              <Text style={[styles.overviewValue, { color: '#64748b' }]}>45%</Text>
            </View>
          </View>
        </View>

        {/* Security Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialIcons name="shield" size={20} color="#64748b" />
            <View style={styles.statusHeaderText}>
              <Text style={styles.statusTitle}>{t('security.status')}</Text>
              <Text style={styles.statusSubtitle}>{t('security.lastScan')}</Text>
            </View>
            {/* Alert Count Badge */}
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>0</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: '#64748b' }]} />
            <Text style={styles.statusText}>{t('security.allClear')}</Text>
          </View>
          <Pressable style={styles.viewDetailsButton} onPress={() => openModal('security')}>
            <Text style={styles.viewDetailsText}>{t('security.viewDetails')}</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#64748b" />
          </Pressable>
        </View>

        {/* Credit & Inclusion Card */}
        <CreditInclusionCard
          alternativeCreditScore={82}
          financialStabilityIndex={75}
          loanReadinessScore={88}
          creditBuilderProgress={65}
          onLearnMore={() => openModal('credit')}
        />

        {/* Platform Activity Feed */}
        <ActivityFeed 
          events={activityEvents} 
          maxItems={5} 
          onViewAll={() => openModal('activity')}
        />

        {/* Loan Eligibility Card */}
        <View style={styles.loanCard}>
          <View style={styles.loanHeader}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#64748b" />
            <Text style={styles.loanTitle}>{t('loan.eligibility')}</Text>
          </View>
          <Text style={styles.loanAmount}>₹3,00,000</Text>
          <Text style={styles.loanType}>{t('loan.personalLoan')}</Text>
          <Pressable style={styles.applyButton}>
            <Text style={styles.applyButtonText}>{t('loan.applyNow')}</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <MaterialIcons name="assessment" size={20} color="#64748b" />
            <Text style={styles.scoreLabel}>{t('dashboard.inclusionScore')}</Text>
          </View>
          <Text style={styles.scoreValue}>{inclusionScore}</Text>
          <Text style={styles.scoreSubtext}>{t('common.outOf')} 100</Text>
        </View>

        {/* Risk Profile Badge */}
        <RiskBadge level={mockRiskProfile.level} />

        {/* Dashboard Charts - Financial Visualization */}
        <DashboardCharts
          income={mockUser.monthly_income}
          expenses={expenses}
          savings={mockUser.monthly_savings}
          inclusionScore={inclusionScore}
        />

        {/* Health Snapshot */}
        <HealthSnapshot
          income={mockUser.monthly_income}
          expenses={expenses}
          savings={mockUser.monthly_savings}
          emi={mockDetectedEMI}
        />

        {/* Gemini AI Insights */}
        <InsightCard
          user={mockUser}
          inclusionScore={inclusionScore}
          riskProfile={mockRiskProfile}
          detectedEMI={mockDetectedEMI}
        />

        {/* Enhanced Features */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="auto-awesome" size={20} color="#0f172a" />
            <Text style={styles.sectionTitle}>Financial Tools</Text>
          </View>
          
          {/* Credit Builder Enhanced */}
          <Pressable style={styles.enhancedCard} onPress={() => setCreditBuilderVisible(true)}>
            <View style={styles.enhancedCardHeader}>
              <MaterialIcons name="trending-up" size={24} color="#10b981" />
              <Text style={styles.enhancedCardTitle}>Build Credit Score</Text>
            </View>
            <Text style={styles.enhancedCardDesc}>
              Get personalized tips to improve your credit score from {userProfile.creditScore || 750} to 800+
            </Text>
            <View style={styles.enhancedCardStats}>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>+25</Text>
                <Text style={styles.enhancedStatLabel}>Potential Increase</Text>
              </View>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>6</Text>
                <Text style={styles.enhancedStatLabel}>Months Timeline</Text>
              </View>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>12</Text>
                <Text style={styles.enhancedStatLabel}>Action Items</Text>
              </View>
            </View>
          </Pressable>

          {/* Investment Guidance Enhanced */}
          <Pressable style={styles.enhancedCard} onPress={() => setInvestmentGuidanceVisible(true)}>
            <View style={styles.enhancedCardHeader}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#3b82f6" />
              <Text style={styles.enhancedCardTitle}>Investment Guidance</Text>
            </View>
            <Text style={styles.enhancedCardDesc}>
              Personalized investment recommendations based on your ₹{mockUser.monthly_savings.toLocaleString()} monthly surplus
            </Text>
            <View style={styles.enhancedCardStats}>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>₹5K</Text>
                <Text style={styles.enhancedStatLabel}>Suggested SIP</Text>
              </View>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>12%</Text>
                <Text style={styles.enhancedStatLabel}>Expected Return</Text>
              </View>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>5</Text>
                <Text style={styles.enhancedStatLabel}>Fund Options</Text>
              </View>
            </View>
          </Pressable>

          {/* Regulation Simplified Enhanced */}
          <Pressable style={styles.enhancedCard} onPress={() => setRegulationVisible(true)}>
            <View style={styles.enhancedCardHeader}>
              <MaterialIcons name="gavel" size={24} color="#8b5cf6" />
              <Text style={styles.enhancedCardTitle}>Learn Regulations</Text>
            </View>
            <Text style={styles.enhancedCardDesc}>
              Simplified explanations of financial regulations, tax benefits, and compliance requirements
            </Text>
            <View style={styles.enhancedCardStats}>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>25+</Text>
                <Text style={styles.enhancedStatLabel}>Topics Covered</Text>
              </View>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>₹1.5L</Text>
                <Text style={styles.enhancedStatLabel}>Tax Savings</Text>
              </View>
              <View style={styles.enhancedStat}>
                <Text style={styles.enhancedStatValue}>7</Text>
                <Text style={styles.enhancedStatLabel}>Categories</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Scam Detection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="shield" size={20} color="#0f172a" />
            <Text style={styles.sectionTitle}>{t('scam.numberCheck')}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardDesc}>{t('scam.checkSuspicious')}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={t('scam.enterPhone')}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <Pressable style={styles.checkButton} onPress={handleCheckNumber}>
                <Text style={styles.buttonText}>{t('scam.check')}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Message Scanner */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="search" size={20} color="#0f172a" />
            <Text style={styles.sectionTitle}>{t('message.scanner')}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardDesc}>{t('message.scanSuspicious')}</Text>
            <TextInput
              style={styles.messageInput}
              placeholder={t('message.pasteHere')}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Pressable style={styles.scanButton} onPress={handleScanMessage}>
              <Text style={styles.buttonText}>{t('message.scan')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Detailed View Modal */}
      <DetailedViewModal
        type={modalType}
        visible={modalVisible}
        onClose={closeModal}
        userData={userProfile}
      />

      {/* Credit Builder Modal */}
      {creditBuilderVisible && (
        <Modal
          visible={creditBuilderVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setCreditBuilderVisible(false)}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <CreditBuilder
              userData={userProfile}
              onClose={() => setCreditBuilderVisible(false)}
            />
          </SafeAreaView>
        </Modal>
      )}

      {/* Investment Guidance Modal */}
      {investmentGuidanceVisible && (
        <Modal
          visible={investmentGuidanceVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setInvestmentGuidanceVisible(false)}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <InvestmentGuidance
              userData={userProfile}
              onClose={() => setInvestmentGuidanceVisible(false)}
            />
          </SafeAreaView>
        </Modal>
      )}

      {/* Regulation Simplified Modal */}
      {regulationVisible && (
        <Modal
          visible={regulationVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setRegulationVisible(false)}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Financial Regulations Simplified</Text>
                <Pressable 
                  style={styles.closeButton} 
                  onPress={() => setRegulationVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#64748b" />
                </Pressable>
              </View>
              <RegulationSimplified />
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  gradientHeader: {
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64748b',
    borderWidth: 2,
    borderColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '400',
  },
  langButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  scrollContent: {
    padding: 16,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewItem: {
    width: '31%',
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusHeaderText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '400',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  alertBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  loanCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  loanTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  loanAmount: {
    fontSize: 36,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: -1,
  },
  loanType: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '600',
    color: '#0f172a',
  },
  scoreSubtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  checkButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    minHeight: 100,
    color: '#0f172a',
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  creditBuilderStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  investmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  regulationTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16,
  },
  topicTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
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
  // Enhanced Cards Styles
  enhancedCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  enhancedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  enhancedCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 12,
  },
  enhancedCardDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  enhancedCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  enhancedStat: {
    alignItems: 'center',
    flex: 1,
  },
  enhancedStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  enhancedStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
});
