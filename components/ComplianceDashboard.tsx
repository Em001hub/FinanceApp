import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type TabType = 'compliance' | 'audit' | 'usage' | 'explainability';

interface AuditLog {
  id: string;
  action: string;
  timestamp: Date;
  user: string;
  result: 'success' | 'failed';
}

interface ComplianceDashboardProps {
  rbiCompliant?: boolean;
  auditLogs?: AuditLog[];
  dataUsageSummary?: {
    smsAccess: number;
    notificationAccess: number;
    locationAccess: number;
  };
  aiDecisions?: Array<{
    id: string;
    decision: string;
    reasoning: string;
    timestamp: Date;
  }>;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  rbiCompliant = true,
  auditLogs = [
    { id: '1', action: 'KYC Verification', timestamp: new Date(), user: 'System', result: 'success' },
    { id: '2', action: 'Fraud Detection Scan', timestamp: new Date(Date.now() - 3600000), user: 'AI Agent', result: 'success' },
    { id: '3', action: 'Data Consent Update', timestamp: new Date(Date.now() - 7200000), user: 'User', result: 'success' },
  ],
  dataUsageSummary = { smsAccess: 45, notificationAccess: 23, locationAccess: 12 },
  aiDecisions = [
    { 
      id: '1', 
      decision: 'Loan Approved', 
      reasoning: 'Credit score above threshold, stable income pattern, low risk profile',
      timestamp: new Date()
    },
    { 
      id: '2', 
      decision: 'Transaction Flagged', 
      reasoning: 'Unusual spending pattern detected, high amount at unusual time',
      timestamp: new Date(Date.now() - 1800000)
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('compliance');

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCompliance = () => (
    <View style={styles.tabContent}>
      <View style={styles.complianceCard}>
        <View style={styles.complianceHeader}>
          <MaterialIcons
            name={rbiCompliant ? 'verified' : 'error-outline'}
            size={48}
            color={rbiCompliant ? '#10b981' : '#ef4444'}
          />
          <Text style={styles.complianceStatus}>
            {rbiCompliant ? 'RBI Compliant' : 'Non-Compliant'}
          </Text>
        </View>
        <Text style={styles.complianceDescription}>
          {rbiCompliant
            ? 'Your account meets all RBI regulatory requirements for digital lending platforms.'
            : 'Some compliance requirements need attention. Please review the audit logs.'}
        </Text>
      </View>

      <View style={styles.checklistCard}>
        <Text style={styles.checklistTitle}>Compliance Checklist</Text>
        <View style={styles.checklistItem}>
          <MaterialIcons name="check-circle" size={20} color="#10b981" />
          <Text style={styles.checklistText}>KYC Verification Complete</Text>
        </View>
        <View style={styles.checklistItem}>
          <MaterialIcons name="check-circle" size={20} color="#10b981" />
          <Text style={styles.checklistText}>Data Consent Obtained</Text>
        </View>
        <View style={styles.checklistItem}>
          <MaterialIcons name="check-circle" size={20} color="#10b981" />
          <Text style={styles.checklistText}>Privacy Policy Accepted</Text>
        </View>
        <View style={styles.checklistItem}>
          <MaterialIcons name="check-circle" size={20} color="#10b981" />
          <Text style={styles.checklistText}>Fraud Detection Active</Text>
        </View>
      </View>
    </View>
  );

  const renderAuditLogs = () => (
    <ScrollView style={styles.tabContent}>
      {auditLogs.map((log) => (
        <View key={log.id} style={styles.logItem}>
          <View style={styles.logHeader}>
            <MaterialIcons
              name={log.result === 'success' ? 'check-circle' : 'error'}
              size={16}
              color={log.result === 'success' ? '#10b981' : '#ef4444'}
            />
            <Text style={styles.logAction}>{log.action}</Text>
          </View>
          <Text style={styles.logDetails}>
            User: {log.user} • {formatTimestamp(log.timestamp)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderDataUsage = () => (
    <View style={styles.tabContent}>
      <View style={styles.usageCard}>
        <View style={styles.usageItem}>
          <MaterialIcons name="sms" size={24} color="#10b981" />
          <View style={styles.usageInfo}>
            <Text style={styles.usageLabel}>SMS Access</Text>
            <Text style={styles.usageValue}>{dataUsageSummary.smsAccess} messages parsed</Text>
          </View>
        </View>
        <View style={styles.usageItem}>
          <MaterialIcons name="notifications" size={24} color="#10b981" />
          <View style={styles.usageInfo}>
            <Text style={styles.usageLabel}>Notification Access</Text>
            <Text style={styles.usageValue}>
              {dataUsageSummary.notificationAccess} notifications processed
            </Text>
          </View>
        </View>
        <View style={styles.usageItem}>
          <MaterialIcons name="location-on" size={24} color="#10b981" />
          <View style={styles.usageInfo}>
            <Text style={styles.usageLabel}>Location Access</Text>
            <Text style={styles.usageValue}>
              {dataUsageSummary.locationAccess} location checks
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderExplainability = () => (
    <ScrollView style={styles.tabContent}>
      {aiDecisions.map((decision) => (
        <View key={decision.id} style={styles.decisionCard}>
          <Text style={styles.decisionTitle}>{decision.decision}</Text>
          <Text style={styles.decisionReasoning}>{decision.reasoning}</Text>
          <Text style={styles.decisionTimestamp}>{formatTimestamp(decision.timestamp)}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="gavel" size={24} color="#10b981" />
        <Text style={styles.title}>Compliance Dashboard</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'compliance' && styles.activeTab]}
          onPress={() => setActiveTab('compliance')}
        >
          <Text style={[styles.tabText, activeTab === 'compliance' && styles.activeTabText]}>
            Status
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'audit' && styles.activeTab]}
          onPress={() => setActiveTab('audit')}
        >
          <Text style={[styles.tabText, activeTab === 'audit' && styles.activeTabText]}>
            Audit Logs
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'usage' && styles.activeTab]}
          onPress={() => setActiveTab('usage')}
        >
          <Text style={[styles.tabText, activeTab === 'usage' && styles.activeTabText]}>
            Data Usage
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'explainability' && styles.activeTab]}
          onPress={() => setActiveTab('explainability')}
        >
          <Text style={[styles.tabText, activeTab === 'explainability' && styles.activeTabText]}>
            AI Decisions
          </Text>
        </Pressable>
      </View>

      {activeTab === 'compliance' && renderCompliance()}
      {activeTab === 'audit' && renderAuditLogs()}
      {activeTab === 'usage' && renderDataUsage()}
      {activeTab === 'explainability' && renderExplainability()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#10b981',
    fontWeight: '600',
  },
  tabContent: {
    minHeight: 200,
    maxHeight: 300,
  },
  complianceCard: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  complianceHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  complianceStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 8,
  },
  complianceDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  checklistCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  checklistText: {
    fontSize: 12,
    color: '#475569',
  },
  logItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logAction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  logDetails: {
    fontSize: 11,
    color: '#64748b',
  },
  usageCard: {
    gap: 16,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  usageInfo: {
    flex: 1,
  },
  usageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 12,
    color: '#64748b',
  },
  decisionCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  decisionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  decisionReasoning: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  decisionTimestamp: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
