import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import SecurityService from '../services/SecurityService';
import { geminiService } from '../services/GeminiService';
import SMSListener from '../services/SMSListener';
import NotificationListener from '../services/NotificationListener';
import BehavioralProfile from '../services/BehavioralProfile';
import { Transaction, FraudAlert, AIMessage } from '../models/SecurityModels';

export default function SecurityScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fraudAlert, setFraudAlert] = useState<FraudAlert | null>(null);
  const [chatMessages, setChatMessages] = useState<AIMessage[]>([]);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [listenersActive, setListenersActive] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<'safe' | 'suspicious'>('safe');
  const [lastScanTime, setLastScanTime] = useState<Date>(new Date());
  const [activeAlerts, setActiveAlerts] = useState<number>(0);
  const [smsMessages, setSmsMessages] = useState<any[]>([]);
  const [parsedTransactions, setParsedTransactions] = useState<any[]>([]);
  const [smsParsingEnabled, setSmsParsingEnabled] = useState(true);

  useEffect(() => {
    loadData();
    initializeListeners();
    initializeBehavioralProfile();
    if (smsParsingEnabled) {
      startSMSParsing();
    }
  }, [smsParsingEnabled]);

  const initializeListeners = async () => {
    const smsStarted = await SMSListener.startListening();
    const notifStarted = await NotificationListener.startListening();
    setListenersActive(smsStarted || notifStarted);

    SMSListener.subscribe((smsTransaction) => {
      if (smsTransaction.parsed) {
        handleNewTransaction(smsTransaction.parsed);
      }
    });

    NotificationListener.subscribe((notifTransaction) => {
      if (notifTransaction.parsed) {
        handleNewTransaction(notifTransaction.parsed);
      }
    });
  };

  const startSMSParsing = async () => {
    try {
      // Mock SMS messages for demo
      const mockSMSMessages = [
        {
          id: '1',
          body: 'Your account has been debited by Rs.2,499 on 15-Jan-25 at Amazon. Available balance: Rs.45,678. UPI Ref: 123456789',
          timestamp: new Date(Date.now() - 3600000),
          sender: 'HDFC-BANK'
        },
        {
          id: '2', 
          body: 'Rs.389 debited from A/c XX1234 on 15-Jan-25 for Swiggy transaction. Avl bal: Rs.48,177',
          timestamp: new Date(Date.now() - 7200000),
          sender: 'ICICI-BANK'
        },
        {
          id: '3',
          body: 'Alert: Rs.32,000 debited from your account for Flipkart purchase at 02:14 AM. If not done by you, call immediately.',
          timestamp: new Date(Date.now() - 10800000),
          sender: 'SBI-BANK'
        }
      ];

      setSmsMessages(mockSMSMessages);
      
      // Parse transactions from SMS
      const parsed = mockSMSMessages.map(sms => parseTransactionFromSMS(sms)).filter(Boolean);
      setParsedTransactions(parsed);
      
      // Learn patterns from parsed transactions
      learnFromTransactionPatterns(parsed);
      
    } catch (error) {
      console.error('Error starting SMS parsing:', error);
    }
  };

  const parseTransactionFromSMS = (sms: any) => {
    const body = sms.body.toLowerCase();
    
    // Extract amount
    const amountMatch = body.match(/rs\.?\s*(\d+(?:,\d+)*)/i);
    if (!amountMatch) return null;
    
    const amount = parseInt(amountMatch[1].replace(/,/g, ''));
    
    // Extract merchant/description
    let merchant = 'Unknown';
    if (body.includes('amazon')) merchant = 'Amazon';
    else if (body.includes('swiggy')) merchant = 'Swiggy';
    else if (body.includes('flipkart')) merchant = 'Flipkart';
    else if (body.includes('uber')) merchant = 'Uber';
    else if (body.includes('zomato')) merchant = 'Zomato';
    
    // Extract time if available
    const timeMatch = body.match(/(\d{1,2}:\d{2})/);
    const time = timeMatch ? timeMatch[1] : new Date(sms.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    // Determine transaction type
    const isDebit = body.includes('debited') || body.includes('debit');
    const isCredit = body.includes('credited') || body.includes('credit');
    
    return {
      id: sms.id,
      amount,
      merchant,
      time,
      type: isDebit ? 'debit' : isCredit ? 'credit' : 'unknown',
      source: 'SMS',
      rawSMS: sms.body,
      timestamp: sms.timestamp,
      sender: sms.sender
    };
  };

  const learnFromTransactionPatterns = (transactions: any[]) => {
    // Analyze spending patterns
    const patterns = {
      totalSpent: transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
      averageAmount: 0,
      frequentMerchants: {},
      timePatterns: {},
      unusualTransactions: []
    };
    
    const debitTransactions = transactions.filter(t => t.type === 'debit');
    patterns.averageAmount = patterns.totalSpent / debitTransactions.length || 0;
    
    // Count merchant frequency
    debitTransactions.forEach(t => {
      patterns.frequentMerchants[t.merchant] = (patterns.frequentMerchants[t.merchant] || 0) + 1;
    });
    
    // Analyze time patterns
    debitTransactions.forEach(t => {
      const hour = parseInt(t.time.split(':')[0]);
      const timeSlot = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
      patterns.timePatterns[timeSlot] = (patterns.timePatterns[timeSlot] || 0) + 1;
    });
    
    // Detect unusual transactions
    patterns.unusualTransactions = debitTransactions.filter(t => {
      const hour = parseInt(t.time.split(':')[0]);
      return t.amount > patterns.averageAmount * 2 || (hour >= 0 && hour < 6);
    });
    
    console.log('Learned patterns:', patterns);
    
    // Update UI with learned patterns
    if (patterns.unusualTransactions.length > 0) {
      setActiveAlerts(patterns.unusualTransactions.length);
      setSecurityStatus('suspicious');
    }
  };

  const initializeBehavioralProfile = async () => {
    await BehavioralProfile.initialize('user_001');
  };

  const handleNewTransaction = async (parsedTxn: any) => {
    const analysis = await BehavioralProfile.analyzeTransaction(parsedTxn);
    
    if (analysis.isAnomalous) {
      // Update security status
      setSecurityStatus('suspicious');
      setActiveAlerts(prev => prev + 1);
      
      // Show instant in-app fraud alert
      Alert.alert(
        '⚠️ Suspicious Transaction Detected',
        `Risk Score: ${analysis.riskScore}\n\nReasons:\n${analysis.reasons.join('\n')}`,
        [
          { text: 'View Details', onPress: () => loadData() },
          { text: 'OK' },
        ]
      );
    }

    await BehavioralProfile.updateWithTransaction(parsedTxn);
    setLastScanTime(new Date());
  };

  const loadData = async () => {
    setLoading(true);
    
    try {
      const txns = await SecurityService.getTransactions();
      setTransactions(txns);
      
      // Update security status based on transactions
      const suspiciousTxns = txns.filter(t => t.flagged);
      setActiveAlerts(suspiciousTxns.length);
      setSecurityStatus(suspiciousTxns.length > 0 ? 'suspicious' : 'safe');
      
      const alert = await SecurityService.getFraudAlert();
      setFraudAlert(alert);
      
      if (alert) {
        const explanation = await geminiService.explainFraud(alert);
        
        setChatMessages([
          {
            id: '1',
            role: 'ai',
            content: explanation,
            timestamp: new Date(),
          },
        ]);
      }
      
      setLastScanTime(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSafe = async () => {
    if (!fraudAlert) return;
    
    try {
      setLoading(true);
      const success = await SecurityService.markAsSafe(fraudAlert.transactionId);
      if (success) {
        Alert.alert('Success', 'Transaction marked as safe');
        setFraudAlert({ ...fraudAlert, status: 'confirmed' });
        // Refresh data to update UI
        await loadData();
      } else {
        Alert.alert('Error', 'Failed to mark transaction as safe. Please try again.');
      }
    } catch (error) {
      console.error('Error marking as safe:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportFraud = async () => {
    if (!fraudAlert) return;
    
    try {
      setLoading(true);
      const success = await SecurityService.reportFraud(fraudAlert.transactionId);
      if (success) {
        Alert.alert('Reported', 'Fraud report submitted successfully');
        setFraudAlert({ ...fraudAlert, status: 'reported' });
        // Refresh data to update UI
        await loadData();
      } else {
        Alert.alert('Error', 'Failed to report fraud. Please try again.');
      }
    } catch (error) {
      console.error('Error reporting fraud:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuestion = async () => {
    if (!userQuestion.trim() || !fraudAlert) return;
    
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuestion,
      timestamp: new Date(),
    };
    setChatMessages([...chatMessages, userMsg]);
    
    setLoading(true);
    setUserQuestion('');
    
    const response = await geminiService.askQuestion(userQuestion, fraudAlert);
    
    const aiMsg: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: response,
      timestamp: new Date(),
    };
    
    setChatMessages([...chatMessages, userMsg, aiMsg]);
    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatLastScan = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastScanTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return lastScanTime.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <View style={styles.navButtons}>
            <Pressable style={styles.navButtonActive}>
              <Text style={styles.navButtonTextActive}>Insights</Text>
            </Pressable>
            <Pressable style={styles.navButton}>
              <Text style={styles.navButtonText}>Benefits</Text>
            </Pressable>
          </View>
          <Pressable style={styles.bellButton}>
            <MaterialIcons name="notifications-none" size={20} color="#374151" />
            {listenersActive && <View style={styles.bellDot} />}
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Security Dashboard - Main Overview */}
        <View style={styles.content}>
          <View style={styles.securityDashboard}>
            <View style={styles.dashboardHeader}>
              <View>
                <Text style={styles.dashboardStatus}>
                  {securityStatus === 'safe' ? '✓ Security Status: Safe' : '⚠️ Security Status: Suspicious Activity'}
                </Text>
                <Text style={styles.dashboardSubtext}>Last Scan: {formatLastScan()}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: securityStatus === 'safe' ? '#d1fae5' : '#fef2f2' }
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  { color: securityStatus === 'safe' ? '#059669' : '#ef4444' }
                ]}>
                  {securityStatus === 'safe' ? 'Safe' : 'Alert'}
                </Text>
              </View>
            </View>
            {activeAlerts > 0 && (
              <View style={styles.alertsRow}>
                <MaterialIcons name="error-outline" size={16} color="#ef4444" />
                <Text style={styles.alertsText}>
                  {activeAlerts} active fraud {activeAlerts === 1 ? 'alert' : 'alerts'}
                </Text>
              </View>
            )}
          </View>

          {/* Threat Level Card */}
          <View style={styles.threatCard}>
            <View style={styles.threatCardHeader}>
              <View>
                <Text style={styles.threatValue}>
                  {securityStatus === 'safe' ? 'Low' : 'High'}
                </Text>
                <Text style={styles.threatLabel}>Risk Level</Text>
                <Text style={styles.threatSubtext}>
                  {securityStatus === 'safe' ? 'All systems secure' : 'Suspicious activity detected'}
                </Text>
              </View>
              <View style={[
                styles.threatIconContainer,
                { backgroundColor: securityStatus === 'safe' ? '#d1fae5' : '#fef2f2' }
              ]}>
                <MaterialIcons 
                  name={securityStatus === 'safe' ? 'shield' : 'warning'} 
                  size={24} 
                  color={securityStatus === 'safe' ? '#059669' : '#ef4444'} 
                />
              </View>
            </View>
          </View>

          {/* SMS Parsing Section */}
          <Text style={styles.sectionTitle}>SMS Transaction Parsing</Text>
          <Text style={styles.sectionSubtitle}>
            AI-powered SMS analysis for automatic transaction detection
          </Text>
          <View style={styles.smsParsingCard}>
            <View style={styles.smsParsingHeader}>
              <View style={styles.smsParsingLeft}>
                <MaterialIcons name="sms" size={24} color="#10b981" />
                <View>
                  <Text style={styles.smsParsingTitle}>SMS Parsing</Text>
                  <Text style={styles.smsParsingDesc}>
                    {smsParsingEnabled ? 'Active - Monitoring SMS' : 'Disabled'}
                  </Text>
                </View>
              </View>
              <Pressable 
                style={[styles.toggleButton, smsParsingEnabled && styles.toggleButtonActive]}
                onPress={() => setSmsParsingEnabled(!smsParsingEnabled)}
              >
                <Text style={[styles.toggleButtonText, smsParsingEnabled && styles.toggleButtonTextActive]}>
                  {smsParsingEnabled ? 'ON' : 'OFF'}
                </Text>
              </Pressable>
            </View>
            
            <View style={styles.smsStats}>
              <View style={styles.smsStatItem}>
                <Text style={styles.smsStatValue}>{smsMessages.length}</Text>
                <Text style={styles.smsStatLabel}>SMS Processed</Text>
              </View>
              <View style={styles.smsStatItem}>
                <Text style={styles.smsStatValue}>{parsedTransactions.length}</Text>
                <Text style={styles.smsStatLabel}>Transactions Found</Text>
              </View>
              <View style={styles.smsStatItem}>
                <Text style={styles.smsStatValue}>
                  ₹{parsedTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
                </Text>
                <Text style={styles.smsStatLabel}>Total Spent</Text>
              </View>
            </View>

            {parsedTransactions.length > 0 && (
              <View style={styles.recentTransactions}>
                <Text style={styles.recentTransactionsTitle}>Recent Parsed Transactions</Text>
                {parsedTransactions.slice(0, 3).map((txn, index) => (
                  <View key={index} style={styles.parsedTransactionItem}>
                    <View style={styles.parsedTransactionLeft}>
                      <MaterialIcons name="store" size={16} color="#6b7280" />
                      <View>
                        <Text style={styles.parsedTransactionMerchant}>{txn.merchant}</Text>
                        <Text style={styles.parsedTransactionTime}>{txn.time} • {txn.sender}</Text>
                      </View>
                    </View>
                    <Text style={[styles.parsedTransactionAmount, { color: txn.type === 'debit' ? '#ef4444' : '#10b981' }]}>
                      {txn.type === 'debit' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Security Status */}
          <Text style={styles.sectionTitle}>Security Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <MaterialIcons name="check-circle" size={20} color="#059669" />
              <Text style={styles.statusText}>Real-time Monitoring: Active</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialIcons name="check-circle" size={20} color="#059669" />
              <Text style={styles.statusText}>Behavioral Analysis: Active</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialIcons name="check-circle" size={20} color="#059669" />
              <Text style={styles.statusText}>Geo-location Tracking: Active</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialIcons name="check-circle" size={20} color="#059669" />
              <Text style={styles.statusText}>AI Fraud Detection: Active</Text>
            </View>
          </View>

          {/* Security Metrics */}
          <Text style={styles.sectionTitle}>Security Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <MaterialIcons name="verified-user" size={24} color="#059669" />
              <Text style={styles.metricValue}>98.5%</Text>
              <Text style={styles.metricLabel}>Detection Rate</Text>
            </View>
            <View style={styles.metricCard}>
              <MaterialIcons name="speed" size={24} color="#3b82f6" />
              <Text style={styles.metricValue}>{'<2s'}</Text>
              <Text style={styles.metricLabel}>Response Time</Text>
            </View>
            <View style={styles.metricCard}>
              <MaterialIcons name="block" size={24} color="#ef4444" />
              <Text style={styles.metricValue}>{transactions.filter(t => t.flagged).length}</Text>
              <Text style={styles.metricLabel}>Blocked Today</Text>
            </View>
            <View style={styles.metricCard}>
              <MaterialIcons name="savings" size={24} color="#f59e0b" />
              <Text style={styles.metricValue}>₹2.4L</Text>
              <Text style={styles.metricLabel}>Saved This Month</Text>
            </View>
          </View>

          {/* Account Protection */}
          <Text style={styles.sectionTitle}>Account Protection</Text>
          <View style={styles.protectionCard}>
            <View style={styles.protectionItem}>
              <View style={styles.protectionLeft}>
                <MaterialIcons name="lock" size={20} color="#059669" />
                <View>
                  <Text style={styles.protectionTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.protectionDesc}>Extra layer of security</Text>
                </View>
              </View>
              <View style={styles.enabledBadge}>
                <Text style={styles.enabledText}>Enabled</Text>
              </View>
            </View>
            <View style={styles.protectionItem}>
              <View style={styles.protectionLeft}>
                <MaterialIcons name="fingerprint" size={20} color="#059669" />
                <View>
                  <Text style={styles.protectionTitle}>Biometric Login</Text>
                  <Text style={styles.protectionDesc}>Fingerprint & Face ID</Text>
                </View>
              </View>
              <View style={styles.enabledBadge}>
                <Text style={styles.enabledText}>Enabled</Text>
              </View>
            </View>
            <View style={styles.protectionItem}>
              <View style={styles.protectionLeft}>
                <MaterialIcons name="vpn-key" size={20} color="#059669" />
                <View>
                  <Text style={styles.protectionTitle}>Device Authorization</Text>
                  <Text style={styles.protectionDesc}>Trusted devices only</Text>
                </View>
              </View>
              <View style={styles.enabledBadge}>
                <Text style={styles.enabledText}>Enabled</Text>
              </View>
            </View>
          </View>

          {/* Spending Patterns */}
          <Text style={styles.sectionTitle}>Spending Patterns</Text>
          <View style={styles.patternsCard}>
            <View style={styles.patternRow}>
              <Text style={styles.patternLabel}>Average Transaction</Text>
              <Text style={styles.patternValue}>₹2,450</Text>
            </View>
            <View style={styles.patternRow}>
              <Text style={styles.patternLabel}>Most Active Time</Text>
              <Text style={styles.patternValue}>2 PM - 6 PM</Text>
            </View>
            <View style={styles.patternRow}>
              <Text style={styles.patternLabel}>Frequent Merchants</Text>
              <Text style={styles.patternValue}>Amazon, Swiggy, Uber</Text>
            </View>
            <View style={styles.patternRow}>
              <Text style={styles.patternLabel}>Unusual Activity</Text>
              <Text style={[styles.patternValue, { color: '#ef4444' }]}>
                {activeAlerts > 0 ? `${activeAlerts} detected` : 'None detected'}
              </Text>
            </View>
          </View>

          {/* Fraud Timeline */}
          <Text style={styles.sectionTitle}>Fraud Timeline</Text>
          <View style={styles.timelineCard}>
            {/* Timeline Event 1 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLine} />
              <View style={[styles.timelineIcon, { backgroundColor: '#fef2f2' }]}>
                <MaterialIcons name="warning" size={16} color="#ef4444" />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>Suspicious Transaction Detected</Text>
                  <Text style={styles.timelineTime}>2:14 AM</Text>
                </View>
                <Text style={styles.timelineDesc}>High-value transaction to Flipkart at unusual time</Text>
                <View style={styles.timelineDetails}>
                  <Text style={styles.timelineDetail}>Amount: ₹32,000</Text>
                  <Text style={styles.timelineDetail}>Merchant: Flipkart</Text>
                </View>
                <View style={styles.timelineBadge}>
                  <Text style={styles.timelineBadgeText}>Today</Text>
                </View>
              </View>
            </View>

            {/* Timeline Event 2 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLine} />
              <View style={[styles.timelineIcon, { backgroundColor: '#fffbeb' }]}>
                <MaterialIcons name="notifications" size={16} color="#f59e0b" />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>SMS Alert Sent</Text>
                  <Text style={styles.timelineTime}>2:15 AM</Text>
                </View>
                <Text style={styles.timelineDesc}>Fraud alert sent to registered mobile number</Text>
                <View style={styles.timelineBadge}>
                  <Text style={styles.timelineBadgeText}>Today</Text>
                </View>
              </View>
            </View>

            {/* Timeline Event 3 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLine} />
              <View style={[styles.timelineIcon, { backgroundColor: '#eff6ff' }]}>
                <MaterialIcons name="verified-user" size={16} color="#3b82f6" />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>User Verification Pending</Text>
                  <Text style={styles.timelineTime}>2:15 AM</Text>
                </View>
                <Text style={styles.timelineDesc}>Waiting for user to verify transaction</Text>
                <View style={styles.timelineBadge}>
                  <Text style={styles.timelineBadgeText}>Today</Text>
                </View>
              </View>
            </View>

            {/* Timeline Event 4 */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, { backgroundColor: '#f0fdf4' }]}>
                <MaterialIcons name="check-circle" size={16} color="#10b981" />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>Behavioral Analysis Complete</Text>
                  <Text style={styles.timelineTime}>2:14 AM</Text>
                </View>
                <Text style={styles.timelineDesc}>Transaction pattern analyzed successfully</Text>
                <View style={styles.timelineBadge}>
                  <Text style={styles.timelineBadgeText}>Today</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Transactions Monitoring List */}
          <Text style={styles.sectionTitle}>Transactions Monitoring</Text>
          <Text style={styles.sectionSubtitle}>
            Real-time transaction analysis with risk assessment
          </Text>
          {transactions.map((txn) => (
            <View
              key={txn.id}
              style={[
                styles.transactionCard,
                txn.flagged && styles.transactionFlagged,
              ]}
            >
              <View style={styles.transactionRow}>
                <View style={styles.merchantIcon}>
                  <MaterialIcons name="store" size={20} color="#6b7280" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.merchantName}>{txn.merchant}</Text>
                  <View style={styles.transactionMeta}>
                    <Text style={styles.transactionTime}>{txn.time}</Text>
                    <Text style={styles.transactionDot}>•</Text>
                    <Text style={styles.transactionSource}>
                      {txn.source || 'UPI'}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </Text>
                  <View style={[
                    styles.riskPill,
                    { backgroundColor: getRiskColor(txn.riskLevel) + '15' }
                  ]}>
                    <Text style={[
                      styles.riskPillText,
                      { color: getRiskColor(txn.riskLevel) }
                    ]}>
                      {txn.riskLevel} Risk
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Fraud Alert Panel */}
          {fraudAlert && (
            <View style={styles.fraudCard}>
              <View style={styles.fraudHeader}>
                <View style={styles.fraudBadge}>
                  <MaterialIcons name="error-outline" size={16} color="#ef4444" />
                  <Text style={styles.fraudBadgeText}>Fraud Alert</Text>
                </View>
                <Text style={styles.fraudTimestamp}>{formatLastScan()}</Text>
              </View>
              
              <Text style={styles.fraudTitle}>Suspicious Transaction Detected</Text>
              <Text style={styles.fraudDescription}>
                This transaction has been flagged by our AI fraud detection system
              </Text>
              
              <View style={styles.fraudGrid}>
                <View style={styles.fraudItem}>
                  <Text style={styles.fraudItemLabel}>Merchant</Text>
                  <Text style={styles.fraudItemValue}>{fraudAlert.merchant}</Text>
                </View>
                <View style={styles.fraudItem}>
                  <Text style={styles.fraudItemLabel}>Amount</Text>
                  <Text style={styles.fraudItemValue}>
                    ₹{fraudAlert.amount.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.fraudItem}>
                  <Text style={styles.fraudItemLabel}>Time</Text>
                  <Text style={styles.fraudItemValue}>{fraudAlert.time}</Text>
                </View>
                <View style={styles.fraudItem}>
                  <Text style={styles.fraudItemLabel}>Risk Score</Text>
                  <Text style={[styles.fraudItemValue, { color: '#ef4444' }]}>
                    {fraudAlert.riskScore}/100
                  </Text>
                </View>
              </View>

              {/* Risk Reasons */}
              <View style={styles.riskReasons}>
                <Text style={styles.riskReasonsTitle}>Why was this flagged?</Text>
                {fraudAlert.reasons?.map((reason, index) => (
                  <View key={index} style={styles.reasonItem}>
                    <MaterialIcons name="info-outline" size={14} color="#6b7280" />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.fraudActions}>
                <Pressable
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={handleMarkAsSafe}
                  disabled={fraudAlert.status !== 'pending'}
                >
                  <Text style={styles.actionButtonTextSecondary}>Mark as Mine</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={handleReportFraud}
                  disabled={fraudAlert.status !== 'pending'}
                >
                  <Text style={styles.actionButtonText}>Report Fraud</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* AI Fraud Explanation Panel */}
          <Text style={styles.sectionTitle}>AI Fraud Explanation</Text>
          <Text style={styles.sectionSubtitle}>
            Ask our AI assistant about fraud risks and security
          </Text>
          <View style={styles.chatContainer}>
            {chatMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.chatBubble,
                  msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAI,
                ]}
              >
                <Text style={[
                  styles.chatText,
                  msg.role === 'user' && styles.chatTextUser
                ]}>
                  {msg.content}
                </Text>
              </View>
            ))}
            {loading && (
              <View style={[styles.chatBubble, styles.chatBubbleAI]}>
                <Text style={styles.chatText}>Analyzing...</Text>
              </View>
            )}
          </View>

          <View style={styles.chatInputBox}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask AI about this transaction..."
              placeholderTextColor="#9ca3af"
              value={userQuestion}
              onChangeText={setUserQuestion}
              multiline
            />
            <Pressable
              style={[
                styles.sendButton,
                (!userQuestion.trim() || loading) && styles.sendButtonDisabled
              ]}
              onPress={handleSendQuestion}
              disabled={!userQuestion.trim() || loading}
            >
              <MaterialIcons name="arrow-upward" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  safeArea: {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  navButtonActive: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  navButtonTextActive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  bellButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 999,
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  securityDashboard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dashboardStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  dashboardSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  alertsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  alertsText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
    marginTop: -8,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionDot: {
    fontSize: 12,
    color: '#d1d5db',
  },
  transactionSource: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  fraudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fraudTimestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
  fraudDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  riskReasons: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  riskReasonsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  content: {
    paddingHorizontal: 24,
  },
  threatCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  threatCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  threatValue: {
    fontSize: 32,
    fontWeight: '500',
    color: '#111827',
    letterSpacing: -1,
  },
  threatLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
  threatSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  threatIconContainer: {
    backgroundColor: '#d1fae5',
    borderRadius: 999,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  protectionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  protectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  protectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  protectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  protectionDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  enabledBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  enabledText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  patternsCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  patternLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  patternValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    bottom: -20,
    width: 2,
    backgroundColor: '#f1f5f9',
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  timelineTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginRight: 8,
  },
  timelineTime: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  timelineDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  timelineDetails: {
    marginBottom: 8,
  },
  timelineDetail: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  timelineBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timelineBadgeText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  transactionFlagged: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  merchantIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  riskPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskPillText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  fraudCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  fraudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 16,
  },
  fraudBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ef4444',
    textTransform: 'uppercase',
  },
  fraudTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 16,
  },
  fraudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  fraudItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  fraudItemLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  fraudItemValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fraudActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#059669',
  },
  actionButtonSecondary: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  actionButtonTextSecondary: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  chatContainer: {
    marginBottom: 16,
  },
  chatBubble: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '85%',
  },
  chatBubbleAI: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chatBubbleUser: {
    backgroundColor: '#111827',
    alignSelf: 'flex-end',
  },
  chatText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  chatTextUser: {
    color: '#fff',
  },
  chatInputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  chatInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    maxHeight: 80,
    paddingVertical: 6,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  // SMS Parsing Styles
  smsParsingCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  smsParsingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  smsParsingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  smsParsingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  smsParsingDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  toggleButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#10b981',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
  smsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  smsStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  smsStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  smsStatLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  recentTransactions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  recentTransactionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  parsedTransactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  parsedTransactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  parsedTransactionMerchant: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  parsedTransactionTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  parsedTransactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
