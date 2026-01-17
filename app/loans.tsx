import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { WorkerAgentsPanel, WorkerAgent } from '../components/WorkerAgentsPanel';
import { LoanProductsMarketplace, LoanProduct } from '../components/LoanProductsMarketplace';

export default function LoansScreen() {
  const [selectedTab, setSelectedTab] = useState<'loans' | 'history' | 'documents'>('loans');
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      role: 'ai',
      content: 'You are eligible for a personal loan of ₹3,00,000. Would you like to proceed?',
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [applicationStep, setApplicationStep] = useState(0);
  const [applicationData, setApplicationData] = useState({
    loanAmount: '',
    purpose: '',
    tenure: '',
    employmentType: '',
    monthlyIncome: '',
    documents: {
      panCard: false,
      aadhaar: false,
      salarySlips: false,
      bankStatements: false,
    }
  });

  // Mock loan history
  const [loanHistory] = useState([
    {
      id: '1',
      type: 'Personal Loan',
      amount: 300000,
      status: 'Active',
      appliedDate: '2024-12-15',
      approvedDate: '2024-12-18',
      emi: 8500,
      remainingAmount: 285000,
      nextEmiDate: '2025-02-15',
      interestRate: 10.5,
      tenure: 36
    },
    {
      id: '2',
      type: 'Home Loan',
      amount: 2500000,
      status: 'Under Review',
      appliedDate: '2025-01-10',
      approvedDate: null,
      emi: null,
      remainingAmount: null,
      nextEmiDate: null,
      interestRate: 8.5,
      tenure: 240
    },
    {
      id: '3',
      type: 'Education Loan',
      amount: 500000,
      status: 'Rejected',
      appliedDate: '2024-11-20',
      approvedDate: null,
      emi: null,
      remainingAmount: null,
      nextEmiDate: null,
      interestRate: 9.0,
      tenure: 84,
      rejectionReason: 'Insufficient income documentation'
    }
  ]);

  // Worker Agents State
  const [workerAgents] = useState<WorkerAgent[]>([
    { id: '1', name: 'KYC Verification', icon: 'verified-user', status: 'complete' },
    { id: '2', name: 'Document Processing', icon: 'description', status: 'complete' },
    { id: '3', name: 'OCR Agent', icon: 'document-scanner', status: 'working', progress: 75, estimatedTime: '30s' },
    { id: '4', name: 'Credit Evaluation', icon: 'assessment', status: 'working', progress: 45, estimatedTime: '1m' },
    { id: '5', name: 'Risk Assessment', icon: 'security', status: 'idle' },
    { id: '6', name: 'Loan Approval', icon: 'check-circle', status: 'idle' },
    { id: '7', name: 'Sanction Letter', icon: 'article', status: 'idle' },
  ]);

  // Loan Products State
  const [loanProducts] = useState<LoanProduct[]>([
    {
      id: '1',
      name: 'Personal Loan',
      icon: 'account-balance-wallet',
      interestRateMin: 8.5,
      interestRateMax: 12.5,
      maxAmount: 1000000,
      tenureMin: 12,
      tenureMax: 60,
      gradient: ['#10b981', '#059669'],
    },
    {
      id: '2',
      name: 'Home Loan',
      icon: 'home',
      interestRateMin: 6.5,
      interestRateMax: 9.5,
      maxAmount: 10000000,
      tenureMin: 60,
      tenureMax: 360,
      gradient: ['#3b82f6', '#2563eb'],
    },
    {
      id: '3',
      name: 'Education Loan',
      icon: 'school',
      interestRateMin: 7.0,
      interestRateMax: 10.0,
      maxAmount: 2000000,
      tenureMin: 36,
      tenureMax: 180,
      gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
      id: '4',
      name: 'Business Loan',
      icon: 'business',
      interestRateMin: 9.0,
      interestRateMax: 15.0,
      maxAmount: 5000000,
      tenureMin: 12,
      tenureMax: 120,
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      id: '5',
      name: 'MSME Loan',
      icon: 'store',
      interestRateMin: 8.0,
      interestRateMax: 13.0,
      maxAmount: 3000000,
      tenureMin: 24,
      tenureMax: 84,
      gradient: ['#ef4444', '#dc2626'],
    },
  ]);

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
    };

    setChatMessages([...chatMessages, newMessage]);
    setUserMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'I understand. Let me help you with that. Processing your request...',
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <View style={styles.navButtons}>
            <Pressable style={styles.navButtonActive}>
              <Text style={styles.navButtonTextActive}>Loans</Text>
            </Pressable>
            <Pressable style={styles.navButton} onPress={() => setSelectedTab('history')}>
              <Text style={styles.navButtonText}>History</Text>
            </Pressable>
            <Pressable style={styles.navButton} onPress={() => setSelectedTab('documents')}>
              <Text style={styles.navButtonText}>Documents</Text>
            </Pressable>
          </View>
          <Pressable style={styles.bellButton}>
            <MaterialIcons name="notifications-none" size={20} color="#374151" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {selectedTab === 'loans' && renderLoansTab()}
          {selectedTab === 'history' && renderHistoryTab()}
          {selectedTab === 'documents' && renderDocumentsTab()}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );

  function renderLoansTab() {
    if (applicationStep > 0) {
      return renderApplicationFlow();
    }

    return (
      <>
        {/* Loan Eligibility Card */}
        <View style={styles.eligibilityCard}>
          <View style={styles.eligibilityHeader}>
            <Text style={styles.eligibilityLabel}>Pre-approved Loan</Text>
            <View style={styles.approvedBadge}>
              <Text style={styles.approvedBadgeText}>Approved</Text>
            </View>
          </View>
          <Text style={styles.eligibilityAmount}>₹3,00,000</Text>
          <Text style={styles.eligibilitySubtext}>Personal Loan • 8.5% p.a.</Text>
          <Pressable style={styles.applyButton} onPress={() => setApplicationStep(1)}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </Pressable>
        </View>

        {/* User Profiling Summary */}
        <View style={styles.profilingCard}>
          <Text style={styles.profilingTitle}>Application Status</Text>
          <View style={styles.profilingRow}>
            <View style={styles.profilingItem}>
              <MaterialIcons name="check-circle" size={16} color="#10b981" />
              <Text style={styles.profilingText}>Profile: Verified</Text>
            </View>
            <View style={styles.profilingItem}>
              <MaterialIcons name="info" size={16} color="#3b82f6" />
              <Text style={styles.profilingText}>Intent: Personal Loan</Text>
            </View>
            <View style={styles.profilingItem}>
              <MaterialIcons name="pending" size={16} color="#f59e0b" />
              <Text style={styles.profilingText}>Requirements: 3/5 Complete</Text>
            </View>
          </View>
        </View>

        {/* Worker Agents Panel */}
        <Text style={styles.sectionTitle}>AI Processing Agents</Text>
        <WorkerAgentsPanel agents={workerAgents} />

        {/* Loan Products Marketplace */}
        <Text style={styles.sectionTitle}>Loan Products</Text>
        <LoanProductsMarketplace 
          products={loanProducts} 
          onCheckEligibility={(productId) => {
            const product = loanProducts.find(p => p.id === productId);
            if (product) {
              Alert.alert(
                'Eligibility Check',
                `Checking eligibility for ${product.name}...\n\nBased on your profile:\n• Credit Score: 750\n• Monthly Income: ₹50,000\n• You are eligible for up to ₹${(product.maxAmount / 100000).toFixed(1)}L\n• Interest Rate: ${product.interestRateMin}% - ${product.interestRateMax}%`,
                [
                  { text: 'Apply Now', onPress: () => {
                    setApplicationData({...applicationData, loanAmount: product.maxAmount.toString()});
                    setApplicationStep(1);
                  }},
                  { text: 'Later', style: 'cancel' }
                ]
              );
            }
          }}
        />

        {/* AI Master Agent Console */}
        <Text style={styles.sectionTitle}>AI Loan Assistant</Text>
        <View style={styles.chatCard}>
          <ScrollView 
            style={styles.chatMessages}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
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
          </ScrollView>

          <View style={styles.chatInputBox}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask about loan options..."
              placeholderTextColor="#9ca3af"
              value={userMessage}
              onChangeText={setUserMessage}
              multiline
            />
            <Pressable
              style={[
                styles.sendButton,
                !userMessage.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!userMessage.trim()}
            >
              <MaterialIcons name="arrow-upward" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  function renderApplicationFlow() {
    const steps = ['Basic Details', 'Employment Info', 'Documents', 'Review', 'Submit'];
    
    return (
      <View style={styles.applicationContainer}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Loan Application</Text>
          <View style={styles.progressSteps}>
            {steps.map((step, index) => (
              <View key={index} style={styles.progressStep}>
                <View style={[
                  styles.progressDot,
                  index < applicationStep ? styles.progressDotCompleted :
                  index === applicationStep ? styles.progressDotActive : styles.progressDotInactive
                ]}>
                  {index < applicationStep ? (
                    <MaterialIcons name="check" size={12} color="#fff" />
                  ) : (
                    <Text style={styles.progressDotText}>{index + 1}</Text>
                  )}
                </View>
                <Text style={styles.progressStepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step Content */}
        <View style={styles.stepContent}>
          {applicationStep === 1 && renderBasicDetailsStep()}
          {applicationStep === 2 && renderEmploymentStep()}
          {applicationStep === 3 && renderDocumentsStep()}
          {applicationStep === 4 && renderReviewStep()}
          {applicationStep === 5 && renderSubmitStep()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <Pressable 
            style={styles.backButton} 
            onPress={() => applicationStep > 1 ? setApplicationStep(applicationStep - 1) : setApplicationStep(0)}
          >
            <Text style={styles.backButtonText}>
              {applicationStep === 1 ? 'Cancel' : 'Back'}
            </Text>
          </Pressable>
          <Pressable 
            style={styles.nextButton} 
            onPress={() => setApplicationStep(applicationStep + 1)}
          >
            <Text style={styles.nextButtonText}>
              {applicationStep === 5 ? 'Submit' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function renderBasicDetailsStep() {
    return (
      <View style={styles.stepCard}>
        <Text style={styles.stepTitle}>Basic Loan Details</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Loan Amount (₹)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter loan amount"
            value={applicationData.loanAmount}
            onChangeText={(text) => setApplicationData({...applicationData, loanAmount: text})}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Purpose</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Purpose of loan"
            value={applicationData.purpose}
            onChangeText={(text) => setApplicationData({...applicationData, purpose: text})}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tenure (months)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Loan tenure"
            value={applicationData.tenure}
            onChangeText={(text) => setApplicationData({...applicationData, tenure: text})}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  }

  function renderEmploymentStep() {
    return (
      <View style={styles.stepCard}>
        <Text style={styles.stepTitle}>Employment Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Employment Type</Text>
          <View style={styles.radioGroup}>
            {['Salaried', 'Self-Employed', 'Business'].map((type) => (
              <Pressable 
                key={type}
                style={styles.radioOption}
                onPress={() => setApplicationData({...applicationData, employmentType: type})}
              >
                <View style={[
                  styles.radioCircle,
                  applicationData.employmentType === type && styles.radioCircleSelected
                ]}>
                  {applicationData.employmentType === type && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>{type}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Monthly Income (₹)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter monthly income"
            value={applicationData.monthlyIncome}
            onChangeText={(text) => setApplicationData({...applicationData, monthlyIncome: text})}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  }

  function renderDocumentsStep() {
    const documents = [
      { key: 'panCard', name: 'PAN Card', required: true },
      { key: 'aadhaar', name: 'Aadhaar Card', required: true },
      { key: 'salarySlips', name: 'Salary Slips (3 months)', required: true },
      { key: 'bankStatements', name: 'Bank Statements (6 months)', required: false },
    ];

    return (
      <View style={styles.stepCard}>
        <Text style={styles.stepTitle}>Document Upload</Text>
        <Text style={styles.stepSubtitle}>Upload the required documents to proceed</Text>
        
        {documents.map((doc) => (
          <View key={doc.key} style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <MaterialIcons 
                name={applicationData.documents[doc.key] ? 'check-circle' : 'radio-button-unchecked'} 
                size={20} 
                color={applicationData.documents[doc.key] ? '#10b981' : '#9ca3af'} 
              />
              <View style={styles.documentText}>
                <Text style={styles.documentName}>{doc.name}</Text>
                {doc.required && <Text style={styles.requiredText}>Required</Text>}
              </View>
            </View>
            <Pressable 
              style={styles.uploadButton}
              onPress={() => {
                setApplicationData({
                  ...applicationData,
                  documents: {
                    ...applicationData.documents,
                    [doc.key]: !applicationData.documents[doc.key]
                  }
                });
                Alert.alert('Document Upload', `${doc.name} ${applicationData.documents[doc.key] ? 'removed' : 'uploaded successfully'}`);
              }}
            >
              <Text style={styles.uploadButtonText}>
                {applicationData.documents[doc.key] ? 'Remove' : 'Upload'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    );
  }

  function renderReviewStep() {
    return (
      <View style={styles.stepCard}>
        <Text style={styles.stepTitle}>Review Application</Text>
        <Text style={styles.stepSubtitle}>Please review your application details</Text>
        
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Loan Details</Text>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Amount:</Text>
            <Text style={styles.reviewValue}>₹{applicationData.loanAmount}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Purpose:</Text>
            <Text style={styles.reviewValue}>{applicationData.purpose}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Tenure:</Text>
            <Text style={styles.reviewValue}>{applicationData.tenure} months</Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Employment</Text>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Type:</Text>
            <Text style={styles.reviewValue}>{applicationData.employmentType}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Monthly Income:</Text>
            <Text style={styles.reviewValue}>₹{applicationData.monthlyIncome}</Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Documents</Text>
          {Object.entries(applicationData.documents).map(([key, uploaded]) => (
            <View key={key} style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Text>
              <Text style={[styles.reviewValue, { color: uploaded ? '#10b981' : '#ef4444' }]}>
                {uploaded ? 'Uploaded' : 'Not Uploaded'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  function renderSubmitStep() {
    return (
      <View style={styles.stepCard}>
        <View style={styles.successIcon}>
          <MaterialIcons name="check-circle" size={64} color="#10b981" />
        </View>
        <Text style={styles.successTitle}>Application Submitted!</Text>
        <Text style={styles.successMessage}>
          Your loan application has been submitted successfully. You will receive updates on your registered mobile number and email.
        </Text>
        <View style={styles.applicationSummary}>
          <Text style={styles.summaryTitle}>Application Summary</Text>
          <Text style={styles.summaryText}>Application ID: LA{Date.now().toString().slice(-6)}</Text>
          <Text style={styles.summaryText}>Amount: ₹{applicationData.loanAmount}</Text>
          <Text style={styles.summaryText}>Expected Processing Time: 3-5 business days</Text>
        </View>
        <Pressable 
          style={styles.doneButton}
          onPress={() => {
            setApplicationStep(0);
            setSelectedTab('history');
          }}
        >
          <Text style={styles.doneButtonText}>View Application Status</Text>
        </Pressable>
      </View>
    );
  }

  function renderHistoryTab() {
    return (
      <>
        <Text style={styles.sectionTitle}>Loan History</Text>
        <Text style={styles.sectionSubtitle}>Track all your loan applications and active loans</Text>
        
        {loanHistory.map((loan) => (
          <View key={loan.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View style={styles.historyTitleContainer}>
                <Text style={styles.historyTitle}>{loan.type}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(loan.status) }
                ]}>
                  <Text style={styles.statusText}>{loan.status}</Text>
                </View>
              </View>
              <Text style={styles.historyAmount}>₹{loan.amount.toLocaleString('en-IN')}</Text>
            </View>
            
            <View style={styles.historyDetails}>
              <View style={styles.historyDetailItem}>
                <Text style={styles.historyDetailLabel}>Applied:</Text>
                <Text style={styles.historyDetailValue}>{loan.appliedDate}</Text>
              </View>
              {loan.approvedDate && (
                <View style={styles.historyDetailItem}>
                  <Text style={styles.historyDetailLabel}>Approved:</Text>
                  <Text style={styles.historyDetailValue}>{loan.approvedDate}</Text>
                </View>
              )}
              <View style={styles.historyDetailItem}>
                <Text style={styles.historyDetailLabel}>Interest Rate:</Text>
                <Text style={styles.historyDetailValue}>{loan.interestRate}% p.a.</Text>
              </View>
              <View style={styles.historyDetailItem}>
                <Text style={styles.historyDetailLabel}>Tenure:</Text>
                <Text style={styles.historyDetailValue}>{loan.tenure} months</Text>
              </View>
              
              {loan.status === 'Active' && (
                <>
                  <View style={styles.historyDetailItem}>
                    <Text style={styles.historyDetailLabel}>Monthly EMI:</Text>
                    <Text style={styles.historyDetailValue}>₹{loan.emi?.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.historyDetailItem}>
                    <Text style={styles.historyDetailLabel}>Remaining:</Text>
                    <Text style={styles.historyDetailValue}>₹{loan.remainingAmount?.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.historyDetailItem}>
                    <Text style={styles.historyDetailLabel}>Next EMI:</Text>
                    <Text style={styles.historyDetailValue}>{loan.nextEmiDate}</Text>
                  </View>
                </>
              )}
              
              {loan.status === 'Rejected' && loan.rejectionReason && (
                <View style={styles.rejectionReason}>
                  <MaterialIcons name="info" size={16} color="#ef4444" />
                  <Text style={styles.rejectionText}>{loan.rejectionReason}</Text>
                </View>
              )}
            </View>
            
            {loan.status === 'Active' && (
              <View style={styles.historyActions}>
                <Pressable style={styles.historyActionButton}>
                  <Text style={styles.historyActionText}>Pay EMI</Text>
                </Pressable>
                <Pressable style={styles.historyActionButton}>
                  <Text style={styles.historyActionText}>View Statement</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
      </>
    );
  }

  function renderDocumentsTab() {
    const documentCategories = [
      {
        title: 'Identity Documents',
        documents: ['PAN Card', 'Aadhaar Card', 'Passport', 'Voter ID']
      },
      {
        title: 'Income Documents',
        documents: ['Salary Slips (3 months)', 'Form 16', 'ITR (2 years)', 'Bank Statements (6 months)']
      },
      {
        title: 'Property Documents (for secured loans)',
        documents: ['Property Papers', 'Valuation Report', 'NOC from Builder', 'Approved Plan']
      }
    ];

    return (
      <>
        <Text style={styles.sectionTitle}>Document Requirements</Text>
        <Text style={styles.sectionSubtitle}>Required documents for different types of loans</Text>
        
        {documentCategories.map((category, index) => (
          <View key={index} style={styles.documentCategory}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.documents.map((doc, docIndex) => (
              <View key={docIndex} style={styles.documentListItem}>
                <MaterialIcons name="description" size={16} color="#6b7280" />
                <Text style={styles.documentListText}>{doc}</Text>
              </View>
            ))}
          </View>
        ))}
        
        <View style={styles.documentTips}>
          <Text style={styles.tipsTitle}>Document Tips</Text>
          <View style={styles.tipItem}>
            <MaterialIcons name="check" size={16} color="#10b981" />
            <Text style={styles.tipText}>Ensure all documents are clear and readable</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialIcons name="check" size={16} color="#10b981" />
            <Text style={styles.tipText}>Upload documents in PDF or JPG format</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialIcons name="check" size={16} color="#10b981" />
            <Text style={styles.tipText}>File size should not exceed 5MB per document</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialIcons name="check" size={16} color="#10b981" />
            <Text style={styles.tipText}>Keep original documents ready for verification</Text>
          </View>
        </View>
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#d1fae5';
      case 'Under Review': return '#fef3c7';
      case 'Rejected': return '#fecaca';
      default: return '#f3f4f6';
    }
  };
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
  eligibilityCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  eligibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eligibilityLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  approvedBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  approvedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  eligibilityAmount: {
    fontSize: 36,
    fontWeight: '500',
    color: '#111827',
    letterSpacing: -1,
    marginBottom: 8,
  },
  eligibilitySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  profilingCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  profilingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  profilingRow: {
    gap: 12,
  },
  profilingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  profilingText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  chatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chatMessages: {
    maxHeight: 300,
    marginBottom: 16,
  },
  chatBubble: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '85%',
  },
  chatBubbleAI: {
    backgroundColor: '#f9fafb',
    alignSelf: 'flex-start',
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
    backgroundColor: '#f9fafb',
    borderRadius: 12,
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
  // Application Flow Styles
  applicationContainer: {
    flex: 1,
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDotCompleted: {
    backgroundColor: '#10b981',
  },
  progressDotActive: {
    backgroundColor: '#059669',
  },
  progressDotInactive: {
    backgroundColor: '#e5e7eb',
  },
  progressDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressStepText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#059669',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  radioText: {
    fontSize: 14,
    color: '#111827',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentText: {
    marginLeft: 12,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  requiredText: {
    fontSize: 12,
    color: '#ef4444',
  },
  uploadButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  applicationSummary: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  doneButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  // History Tab Styles
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  historyTitleContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  historyDetails: {
    marginBottom: 16,
  },
  historyDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  historyDetailLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  historyDetailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  rejectionReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  rejectionText: {
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  historyActionButton: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  historyActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  // Documents Tab Styles
  documentCategory: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  documentListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  documentListText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  documentTips: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
});
