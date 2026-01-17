import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface RegulationTopic {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  examples: string[];
  practicalTips: string[];
  category: 'tax' | 'banking' | 'investment' | 'insurance' | 'digital' | 'pension' | 'gst';
}

export const RegulationSimplified: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('tax');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const regulations: RegulationTopic[] = [
    {
      id: 'section80c',
      title: 'Section 80C Tax Benefits',
      description: 'Tax deduction up to ₹1.5 lakh per year on eligible investments',
      keyPoints: [
        'Maximum deduction: ₹1,50,000 per financial year',
        'Eligible investments: PPF, ELSS, NSC, Tax-saving FDs',
        'Lock-in periods vary by investment type',
        'Reduces taxable income, not tax liability directly'
      ],
      examples: [
        'Invest ₹1,50,000 in PPF → Save ₹46,800 tax (31.2% tax bracket)',
        'ELSS investment of ₹50,000 → Tax saving of ₹15,600',
        'Home loan principal repayment also qualifies'
      ],
      practicalTips: [
        'Start investing early in the financial year',
        'Diversify across different 80C instruments',
        'Consider lock-in periods before investing',
        'Keep investment proofs for ITR filing'
      ],
      category: 'tax'
    },
    {
      id: 'creditScore',
      title: 'Credit Score Regulations',
      description: 'RBI guidelines on credit information and consumer rights',
      keyPoints: [
        'Free credit report once per year from each bureau',
        'Credit bureaus: CIBIL, Experian, Equifax, CRIF',
        'Dispute resolution process within 30 days',
        'Credit score range: 300-900 (higher is better)'
      ],
      examples: [
        'Score 750+: Excellent, best loan rates',
        'Score 650-749: Good, standard rates',
        'Score below 650: May face loan rejections'
      ],
      practicalTips: [
        'Check credit report regularly for errors',
        'Pay all EMIs and credit card bills on time',
        'Keep credit utilization below 30%',
        'Maintain old credit accounts for longer history'
      ],
      category: 'banking'
    },
    {
      id: 'gstBasics',
      title: 'GST Regulations for Businesses',
      description: 'Goods and Services Tax compliance requirements',
      keyPoints: [
        'Registration mandatory for turnover > ₹40 lakh (₹20 lakh for services)',
        'GST rates: 0%, 5%, 12%, 18%, 28%',
        'Monthly/Quarterly return filing required',
        'Input tax credit available on business purchases'
      ],
      examples: [
        'Restaurant bill: 5% GST on food, 18% on AC dining',
        'Mobile phone: 18% GST',
        'Essential items like rice, wheat: 0% GST'
      ],
      practicalTips: [
        'Maintain proper invoice records',
        'File returns on time to avoid penalties',
        'Claim input tax credit promptly',
        'Use GST-compliant accounting software'
      ],
      category: 'gst'
    },
    {
      id: 'kycNorms',
      title: 'Banking KYC Requirements',
      description: 'Know Your Customer norms for bank account operations',
      keyPoints: [
        'Aadhaar linking mandatory for all bank accounts',
        'Periodic KYC update required every 8-10 years',
        'Video KYC now accepted for account opening',
        'Non-compliance leads to account restrictions'
      ],
      examples: [
        'New account: Aadhaar + PAN + Address proof required',
        'NRI accounts: Additional overseas address proof needed',
        'Joint accounts: KYC required for all holders'
      ],
      practicalTips: [
        'Keep KYC documents updated',
        'Use DigiLocker for document storage',
        'Complete KYC before expiry dates',
        'Maintain multiple address proofs'
      ],
      category: 'banking'
    },
    {
      id: 'sebiGuidelines',
      title: 'SEBI Investment Regulations',
      description: 'Securities and Exchange Board guidelines for investors',
      keyPoints: [
        'Mutual fund investments through registered AMCs only',
        'No guaranteed returns in market-linked products',
        'Cooling-off period for insurance-linked investments',
        'Investor grievance redressal mechanism available'
      ],
      examples: [
        'ELSS funds have 3-year lock-in period',
        'SIP can be started with as low as ₹500/month',
        'Direct plans have lower expense ratios than regular plans'
      ],
      practicalTips: [
        'Invest only through SEBI-registered entities',
        'Read scheme documents before investing',
        'Diversify across asset classes',
        'Review portfolio annually'
      ],
      category: 'investment'
    },
    {
      id: 'insuranceRights',
      title: 'Insurance Policyholder Rights',
      description: 'IRDAI guidelines protecting insurance customers',
      keyPoints: [
        '15-day free look period for life insurance',
        '30-day free look period for pension plans',
        'Claim settlement within 30 days of document submission',
        'Ombudsman available for dispute resolution'
      ],
      examples: [
        'Term insurance claim rejected: Approach ombudsman',
        'Health insurance cashless denied: File written complaint',
        'Mis-selling case: Get full premium refund in free look period'
      ],
      practicalTips: [
        'Read policy documents carefully',
        'Disclose all health conditions honestly',
        'Keep premium payment receipts safe',
        'Nominate beneficiaries properly'
      ],
      category: 'insurance'
    },
    {
      id: 'digitalPayments',
      title: 'Digital Payment Regulations',
      description: 'RBI guidelines for UPI, wallets, and digital transactions',
      keyPoints: [
        'UPI transaction limit: ₹1 lakh per day',
        'Wallet KYC: ₹10,000/month without, ₹2 lakh with full KYC',
        'Zero liability for unauthorized transactions if reported within 3 days',
        'Two-factor authentication mandatory for transactions > ₹5,000'
      ],
      examples: [
        'UPI fraud: Report within 3 days for zero liability',
        'Wallet top-up: Full KYC needed for higher limits',
        'Credit card on UPI: ₹2,000 per transaction limit'
      ],
      practicalTips: [
        'Never share UPI PIN or OTP',
        'Use secure networks for transactions',
        'Enable transaction alerts',
        'Report suspicious activities immediately'
      ],
      category: 'digital'
    },
    {
      id: 'npsRegulations',
      title: 'National Pension System (NPS)',
      description: 'PFRDA guidelines for retirement planning',
      keyPoints: [
        'Minimum investment: ₹6,000 per year to keep account active',
        'Partial withdrawal allowed after 3 years (25% of contribution)',
        'At maturity: 60% lump sum + 40% annuity mandatory',
        'Additional tax benefit of ₹50,000 under Section 80CCD(1B)'
      ],
      examples: [
        'Invest ₹50,000 in NPS: Save ₹15,600 tax (beyond 80C limit)',
        'Withdraw 25% at age 50 for daughter\'s marriage',
        'At 60: Get 60% as lump sum, invest 40% in annuity'
      ],
      practicalTips: [
        'Start NPS early for better corpus building',
        'Choose active or auto choice based on risk appetite',
        'Monitor fund performance annually',
        'Don\'t forget annual contribution to keep account active'
      ],
      category: 'pension'
    },
    {
      id: 'epfRegulations',
      title: 'Employee Provident Fund (EPF)',
      description: 'EPFO guidelines for salaried employees retirement savings',
      keyPoints: [
        'Mandatory for companies with 20+ employees',
        '12% employee contribution + 12% employer contribution',
        'Tax-free withdrawal after 5 years of continuous service',
        'Interest rate declared annually (currently ~8.5%)'
      ],
      examples: [
        'Salary ₹50,000: ₹6,000 monthly EPF contribution',
        'After 5 years: Withdraw full amount tax-free',
        'Partial withdrawal allowed for home purchase, medical emergency'
      ],
      practicalTips: [
        'Link Aadhaar and PAN for seamless operations',
        'Check EPF balance regularly on EPFO portal',
        'Transfer EPF when changing jobs',
        'Nominate family members for EPF account'
      ],
      category: 'pension'
    },
    {
      id: 'mutualFundRegulations',
      title: 'Mutual Fund Regulations',
      description: 'SEBI guidelines for mutual fund investments',
      keyPoints: [
        'All mutual funds regulated by SEBI',
        'NAV calculation and disclosure daily',
        'Exit load applicable for early redemption',
        'Systematic Investment Plan (SIP) minimum ₹500'
      ],
      examples: [
        'SIP of ₹5,000 monthly in equity fund',
        'Exit load 1% if redeemed within 1 year',
        'Direct plans have lower expense ratio than regular plans'
      ],
      practicalTips: [
        'Choose direct plans to save on commissions',
        'Diversify across fund categories',
        'Review portfolio annually',
        'Use SIP for rupee cost averaging'
      ],
      category: 'investment'
    },
    {
      id: 'healthInsuranceRegulations',
      title: 'Health Insurance Regulations',
      description: 'IRDAI guidelines for health insurance policies',
      keyPoints: [
        'Waiting period for pre-existing diseases (2-4 years)',
        'Cashless treatment at network hospitals',
        'No claim bonus increases coverage amount',
        'Portability allowed after 8 months'
      ],
      examples: [
        'Family floater policy covers entire family',
        'Critical illness cover provides lump sum benefit',
        'Senior citizen policies available with higher premiums'
      ],
      practicalTips: [
        'Buy health insurance early for lower premiums',
        'Declare all pre-existing conditions honestly',
        'Keep all medical records and bills',
        'Understand policy exclusions clearly'
      ],
      category: 'insurance'
    },
    {
      id: 'termInsuranceRegulations',
      title: 'Term Life Insurance',
      description: 'IRDAI guidelines for term life insurance',
      keyPoints: [
        'Pure protection with no investment component',
        'Lowest premium for highest coverage',
        'Claim settlement ratio varies by insurer',
        'Riders available for additional protection'
      ],
      examples: [
        '₹1 crore cover for ₹15,000 annual premium (age 30)',
        'Accidental death benefit rider doubles coverage',
        'Waiver of premium rider continues policy if disabled'
      ],
      practicalTips: [
        'Buy 10-15 times your annual income as coverage',
        'Choose insurers with high claim settlement ratio',
        'Buy term insurance early for lower premiums',
        'Review coverage needs every 5 years'
      ],
      category: 'insurance'
    },
    {
      id: 'upiRegulations',
      title: 'UPI Transaction Regulations',
      description: 'NPCI and RBI guidelines for UPI payments',
      keyPoints: [
        'Transaction limit: ₹1 lakh per day per bank',
        'No charges for P2P transactions',
        'Merchant transactions may have charges',
        'Two-factor authentication not required for UPI'
      ],
      examples: [
        'Send money instantly using mobile number or UPI ID',
        'Pay at shops by scanning QR code',
        'Set up autopay for recurring payments'
      ],
      practicalTips: [
        'Never share UPI PIN with anyone',
        'Verify recipient details before sending money',
        'Use secure networks for transactions',
        'Enable transaction alerts and limits'
      ],
      category: 'digital'
    },
    {
      id: 'creditCardRegulations',
      title: 'Credit Card Regulations',
      description: 'RBI guidelines for credit card usage and billing',
      keyPoints: [
        'Minimum payment 5% of outstanding amount',
        'Interest charged on outstanding balance (24-48% annually)',
        'Free credit period up to 50 days',
        'Overlimit charges and late payment fees applicable'
      ],
      examples: [
        'Outstanding ₹50,000: Minimum payment ₹2,500',
        'Pay full amount by due date to avoid interest',
        'Cash advance attracts immediate interest charges'
      ],
      practicalTips: [
        'Pay full amount to avoid interest charges',
        'Keep credit utilization below 30%',
        'Set up auto-pay for minimum amount',
        'Monitor statements for unauthorized transactions'
      ],
      category: 'banking'
    },
    {
      id: 'ppfRegulations',
      title: 'Public Provident Fund (PPF)',
      description: 'Government scheme for long-term tax-saving investment',
      keyPoints: [
        '15-year lock-in period with extension option',
        'Maximum investment ₹1.5 lakh per year',
        'Tax-free returns (currently ~7.1% annually)',
        'Partial withdrawal allowed from 7th year'
      ],
      examples: [
        'Invest ₹1.5L annually: Save ₹46,800 tax (31.2% bracket)',
        'After 15 years: Corpus becomes completely tax-free',
        'Loan against PPF available from 3rd year'
      ],
      practicalTips: [
        'Start PPF early to maximize compounding',
        'Make annual contribution before March 31',
        'Can extend in blocks of 5 years after maturity',
        'Nominate family members for PPF account'
      ],
      category: 'tax'
    }
  ];

  const categories = [
    { id: 'tax', name: 'Tax Benefits', icon: 'account-balance' },
    { id: 'banking', name: 'Banking', icon: 'account-balance' },
    { id: 'investment', name: 'Investments', icon: 'trending-up' },
    { id: 'insurance', name: 'Insurance', icon: 'security' },
    { id: 'digital', name: 'Digital Payments', icon: 'payment' },
    { id: 'pension', name: 'Pension', icon: 'elderly' },
    { id: 'gst', name: 'GST', icon: 'receipt' }
  ];

  const filteredRegulations = regulations.filter(reg => reg.category === selectedCategory);

  const toggleExpanded = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const renderRegulationCard = (regulation: RegulationTopic) => {
    const isExpanded = expandedTopic === regulation.id;

    return (
      <Pressable 
        key={regulation.id}
        style={styles.regulationCard}
        onPress={() => toggleExpanded(regulation.id)}
      >
        <View style={styles.regulationHeader}>
          <Text style={styles.regulationTitle}>{regulation.title}</Text>
          <MaterialIcons 
            name={isExpanded ? 'expand-less' : 'expand-more'} 
            size={24} 
            color="#64748b" 
          />
        </View>
        
        <Text style={styles.regulationDescription}>{regulation.description}</Text>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Points</Text>
              {regulation.keyPoints.map((point, index) => (
                <Text key={index} style={styles.bulletPoint}>• {point}</Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Examples</Text>
              {regulation.examples.map((example, index) => (
                <Text key={index} style={styles.exampleText}>💡 {example}</Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Practical Tips</Text>
              {regulation.practicalTips.map((tip, index) => (
                <Text key={index} style={styles.tipText}>✅ {tip}</Text>
              ))}
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.activeCategoryTab
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialIcons 
              name={category.icon as any} 
              size={20} 
              color={selectedCategory === category.id ? '#fff' : '#64748b'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.activeCategoryText
            ]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Regulations List */}
      <ScrollView style={styles.regulationsList} showsVerticalScrollIndicator={false}>
        {filteredRegulations.map(renderRegulationCard)}
        
        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <MaterialIcons name="info" size={20} color="#f59e0b" />
          <Text style={styles.disclaimerText}>
            This information is for educational purposes only. Please consult with qualified 
            financial advisors or tax professionals for personalized advice. Regulations may 
            change over time.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  activeCategoryTab: {
    backgroundColor: '#0f172a',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginLeft: 6,
  },
  activeCategoryText: {
    color: '#fff',
  },
  regulationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  regulationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  regulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regulationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  regulationDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 13,
    color: '#059669',
    lineHeight: 18,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  tipText: {
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
    marginBottom: 4,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
    marginLeft: 8,
    flex: 1,
  },
});