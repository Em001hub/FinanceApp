import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { ConsentManager } from '../components/ConsentManager';
import { ComplianceDashboard } from '../components/ComplianceDashboard';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [smsParsingEnabled, setSmsParsingEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Mock Firebase user data
  const [userProfile] = useState({
    name: 'Rajesh Kumar',
    age: 28,
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    bankAccounts: [
      { bank: 'HDFC Bank', accountNumber: '****1234', type: 'Savings', balance: 45678 },
      { bank: 'ICICI Bank', accountNumber: '****5678', type: 'Current', balance: 12345 },
      { bank: 'SBI', accountNumber: '****9012', type: 'Savings', balance: 78901 }
    ],
    creditScore: 750,
    kycStatus: 'Verified',
    panCard: 'ABCDE1234F',
    aadhaar: '****-****-1234'
  });

  // Consent Manager State
  const [consents, setConsents] = useState([
    {
      id: 'sms',
      title: 'SMS Access',
      description: 'Read SMS for transaction parsing',
      icon: 'sms' as const,
      enabled: true,
      learnMore: 'We read your SMS messages to automatically detect and analyze financial transactions.',
    },
    {
      id: 'notifications',
      title: 'Notification Access',
      description: 'Monitor app notifications for transactions',
      icon: 'notifications' as const,
      enabled: true,
      learnMore: 'We monitor notifications to track your financial activities in real-time.',
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing Consent',
      description: 'Share anonymized data for credit scoring',
      icon: 'share' as const,
      enabled: false,
      learnMore: 'Your anonymized data helps improve credit scoring models.',
    },
    {
      id: 'ai-decisions',
      title: 'AI Decision Consent',
      description: 'Allow AI to make automated decisions',
      icon: 'psychology' as const,
      enabled: true,
      learnMore: 'AI makes automated decisions for fraud detection and loan approvals.',
    },
  ]);

  useEffect(() => {
    // Mock authentication - set user as logged in
    setUser({ email: userProfile.email } as User);
  }, []);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', onPress: () => {
        setUser(null);
        Alert.alert('Success', 'Signed out successfully!');
      }}
    ]);
  };

  const toggleConsent = (id: string) => {
    setConsents(consents.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Please Login</Text>
            <Text style={styles.loginSubtitle}>Authentication required to view profile</Text>
            <Pressable style={styles.loginButton} onPress={() => setUser({ email: userProfile.email } as User)}>
              <Text style={styles.loginButtonText}>Login with Mock Data</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <View style={styles.navButtons}>
            <Pressable style={styles.navButtonActive}>
              <Text style={styles.navButtonTextActive}>Profile</Text>
            </Pressable>
            <Pressable style={styles.navButton}>
              <Text style={styles.navButtonText}>Settings</Text>
            </Pressable>
          </View>
          <Pressable style={styles.bellButton}>
            <MaterialIcons name="settings" size={20} color="#374151" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="account-circle" size={64} color="#059669" />
            </View>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            <Text style={styles.profilePhone}>{userProfile.phone}</Text>
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{userProfile.age}</Text>
                <Text style={styles.profileStatLabel}>Age</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{userProfile.creditScore}</Text>
                <Text style={styles.profileStatLabel}>Credit Score</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{userProfile.bankAccounts.length}</Text>
                <Text style={styles.profileStatLabel}>Bank Accounts</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={16} color="#059669" />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          </View>

          {/* Bank Accounts */}
          <Text style={styles.sectionTitle}>Bank Accounts</Text>
          <View style={styles.bankAccountsCard}>
            {userProfile.bankAccounts.map((account, index) => (
              <View key={index} style={styles.bankAccountItem}>
                <View style={styles.bankAccountLeft}>
                  <MaterialIcons name="account-balance" size={20} color="#6b7280" />
                  <View>
                    <Text style={styles.bankName}>{account.bank}</Text>
                    <Text style={styles.accountDetails}>
                      {account.accountNumber} • {account.type}
                    </Text>
                  </View>
                </View>
                <View style={styles.bankAccountRight}>
                  <Text style={styles.accountBalance}>₹{account.balance.toLocaleString('en-IN')}</Text>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Identity Verification */}
          <Text style={styles.sectionTitle}>Identity Verification</Text>
          <View style={styles.verificationCard}>
            <View style={styles.verificationItem}>
              <View style={styles.verificationLeft}>
                <MaterialIcons name="credit-card" size={20} color="#6b7280" />
                <View>
                  <Text style={styles.verificationText}>Aadhaar Card</Text>
                  <Text style={styles.verificationSubtext}>{userProfile.aadhaar}</Text>
                </View>
              </View>
              <View style={styles.verifiedCheckBadge}>
                <MaterialIcons name="check" size={16} color="#059669" />
                <Text style={styles.verifiedCheckText}>Verified</Text>
              </View>
            </View>
            <View style={styles.verificationItem}>
              <View style={styles.verificationLeft}>
                <MaterialIcons name="account-balance" size={20} color="#6b7280" />
                <View>
                  <Text style={styles.verificationText}>PAN Card</Text>
                  <Text style={styles.verificationSubtext}>{userProfile.panCard}</Text>
                </View>
              </View>
              <View style={styles.verifiedCheckBadge}>
                <MaterialIcons name="check" size={16} color="#059669" />
                <Text style={styles.verifiedCheckText}>Verified</Text>
              </View>
            </View>
            <View style={styles.verificationItem}>
              <View style={styles.verificationLeft}>
                <MaterialIcons name="security" size={20} color="#6b7280" />
                <View>
                  <Text style={styles.verificationText}>KYC Status</Text>
                  <Text style={styles.verificationSubtext}>{userProfile.kycStatus}</Text>
                </View>
              </View>
              <View style={styles.lowRiskBadge}>
                <Text style={styles.lowRiskText}>Complete</Text>
              </View>
            </View>
          </View>

          {/* Permissions & Settings */}
          <Text style={styles.sectionTitle}>Permissions & Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="notifications" size={20} color="#6b7280" />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={notificationsEnabled ? '#059669' : '#f3f4f6'}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="fingerprint" size={20} color="#6b7280" />
                <Text style={styles.settingText}>Biometric Login</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={biometricEnabled ? '#059669' : '#f3f4f6'}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="sms" size={20} color="#6b7280" />
                <Text style={styles.settingText}>SMS Parsing</Text>
              </View>
              <Switch
                value={smsParsingEnabled}
                onValueChange={setSmsParsingEnabled}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={smsParsingEnabled ? '#059669' : '#f3f4f6'}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="location-on" size={20} color="#6b7280" />
                <Text style={styles.settingText}>Location Services</Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={locationEnabled ? '#059669' : '#f3f4f6'}
              />
            </View>
          </View>

          {/* Consent Manager */}
          <Text style={styles.sectionTitle}>Permissions & Consent</Text>
          <ConsentManager 
            consents={consents}
            onToggle={toggleConsent}
          />

          {/* Compliance Dashboard */}
          <Text style={styles.sectionTitle}>Compliance & Privacy</Text>
          <ComplianceDashboard />

          {/* Sign Out Button */}
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
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
    padding: 8,
    borderRadius: 999,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  verificationCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  verificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 2,
  },
  verificationSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  verifiedCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  verifiedCheckText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  lowRiskBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lowRiskText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 14,
    borderRadius: 999,
    gap: 8,
    marginTop: 24,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
  },
  // Bank Accounts Styles
  bankAccountsCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  bankAccountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  bankAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  accountDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  bankAccountRight: {
    alignItems: 'flex-end',
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  activeBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
});
