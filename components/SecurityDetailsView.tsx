import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../services/UserService';

interface SecurityEvent {
  id: string;
  type: 'login' | 'transaction' | 'device' | 'suspicious';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

interface SecurityDetailsViewProps {
  userData: UserProfile;
}

export const SecurityDetailsView: React.FC<SecurityDetailsViewProps> = ({ userData }) => {
  const { t } = useTranslation();
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      title: 'Successful Login',
      description: 'Login from Mumbai, Maharashtra using mobile app',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      severity: 'low'
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Large Transaction Alert',
      description: 'Transaction of ₹25,000 detected - within normal limits',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      severity: 'medium'
    },
    {
      id: '3',
      type: 'device',
      title: 'New Device Registered',
      description: 'iPhone 15 Pro registered for biometric authentication',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      severity: 'low'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'check-circle';
      default: return 'info';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return 'login';
      case 'transaction': return 'payment';
      case 'device': return 'devices';
      case 'suspicious': return 'security';
      default: return 'info';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSecurityAction = (action: string) => {
    Alert.alert('Security Action', `${action} feature will be available soon`);
  };

  return (
    <View style={styles.container}>
      {/* Security Overview */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <MaterialIcons name="shield" size={24} color="#10b981" />
          <Text style={styles.overviewTitle}>Security Overview</Text>
        </View>
        <Text style={styles.overviewStatus}>🛡️ Your account is secure</Text>
        <Text style={styles.overviewDescription}>
          No suspicious activities detected. All security measures are active and functioning properly.
        </Text>
      </View>

      {/* Security Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Security Score</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>95</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <Text style={styles.scoreDescription}>Excellent security posture</Text>
      </View>

      {/* Recent Security Events */}
      <View style={styles.eventsCard}>
        <Text style={styles.eventsTitle}>Recent Security Events</Text>
        {securityEvents.map((event) => (
          <View key={event.id} style={styles.eventItem}>
            <View style={styles.eventHeader}>
              <View style={styles.eventIconContainer}>
                <MaterialIcons 
                  name={getEventIcon(event.type) as any} 
                  size={20} 
                  color="#64748b" 
                />
              </View>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <Text style={styles.eventTime}>{formatTime(event.timestamp)}</Text>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(event.severity) }]}>
                <MaterialIcons 
                  name={getSeverityIcon(event.severity) as any} 
                  size={16} 
                  color="#fff" 
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Security Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Security Actions</Text>
        
        <Pressable 
          style={styles.actionButton} 
          onPress={() => handleSecurityAction('Change Password')}
        >
          <MaterialIcons name="lock" size={20} color="#0f172a" />
          <Text style={styles.actionText}>Change Password</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#64748b" />
        </Pressable>

        <Pressable 
          style={styles.actionButton} 
          onPress={() => handleSecurityAction('Enable 2FA')}
        >
          <MaterialIcons name="security" size={20} color="#0f172a" />
          <Text style={styles.actionText}>Two-Factor Authentication</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#64748b" />
        </Pressable>

        <Pressable 
          style={styles.actionButton} 
          onPress={() => handleSecurityAction('Manage Devices')}
        >
          <MaterialIcons name="devices" size={20} color="#0f172a" />
          <Text style={styles.actionText}>Manage Trusted Devices</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#64748b" />
        </Pressable>

        <Pressable 
          style={styles.actionButton} 
          onPress={() => handleSecurityAction('Privacy Settings')}
        >
          <MaterialIcons name="privacy-tip" size={20} color="#0f172a" />
          <Text style={styles.actionText}>Privacy Settings</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#64748b" />
        </Pressable>
      </View>

      {/* Security Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Security Best Practices</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Use strong, unique passwords for all accounts</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Enable two-factor authentication when available</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Regularly review account activity and statements</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Be cautious of phishing emails and suspicious links</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Keep your devices and apps updated</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overviewCard: {
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
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  overviewStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  overviewDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '600',
    color: '#10b981',
  },
  scoreMax: {
    fontSize: 24,
    fontWeight: '400',
    color: '#64748b',
    marginLeft: 4,
  },
  scoreDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  eventsCard: {
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
  eventsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  eventItem: {
    marginBottom: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    lineHeight: 18,
  },
  eventTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  severityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionsCard: {
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
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginLeft: 12,
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});