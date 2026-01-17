/**
 * Behavioral Profile Engine
 * Tracks user spending patterns and detects anomalies
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SpendingPattern {
  averageTransaction: number;
  maxTransaction: number;
  minTransaction: number;
  totalSpent: number;
  transactionCount: number;
  frequentMerchants: { [merchant: string]: number };
  frequentCategories: { [category: string]: number };
  timePatterns: { [hour: number]: number };
  dayPatterns: { [day: string]: number };
  paymentMethods: { [method: string]: number };
}

export interface BehavioralProfile {
  userId: string;
  patterns: SpendingPattern;
  lastUpdated: Date;
  riskFactors: string[];
  trustScore: number; // 0-100
}

class BehavioralProfileService {
  private storageKey = '@behavioral_profile';
  private profile: BehavioralProfile | null = null;

  /**
   * Initialize profile for user
   */
  async initialize(userId: string): Promise<BehavioralProfile> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      
      if (stored) {
        this.profile = JSON.parse(stored);
        return this.profile!;
      }

      // Create new profile
      this.profile = {
        userId,
        patterns: {
          averageTransaction: 0,
          maxTransaction: 0,
          minTransaction: 0,
          totalSpent: 0,
          transactionCount: 0,
          frequentMerchants: {},
          frequentCategories: {},
          timePatterns: {},
          dayPatterns: {},
          paymentMethods: {},
        },
        lastUpdated: new Date(),
        riskFactors: [],
        trustScore: 50, // Start with neutral score
      };

      await this.save();
      return this.profile;
    } catch (error) {
      console.error('Error initializing profile:', error);
      throw error;
    }
  }

  /**
   * Update profile with new transaction
   */
  async updateWithTransaction(transaction: any): Promise<void> {
    if (!this.profile) {
      await this.initialize('user_001');
    }

    const { merchant, amount, time, source, category } = transaction;
    const patterns = this.profile!.patterns;

    // Update transaction stats
    patterns.transactionCount++;
    patterns.totalSpent += amount;
    patterns.averageTransaction = patterns.totalSpent / patterns.transactionCount;
    patterns.maxTransaction = Math.max(patterns.maxTransaction, amount);
    patterns.minTransaction = patterns.minTransaction === 0 
      ? amount 
      : Math.min(patterns.minTransaction, amount);

    // Update merchant frequency
    patterns.frequentMerchants[merchant] = (patterns.frequentMerchants[merchant] || 0) + 1;

    // Update category frequency
    if (category) {
      patterns.frequentCategories[category] = (patterns.frequentCategories[category] || 0) + 1;
    }

    // Update time patterns
    const hour = this.extractHour(time);
    patterns.timePatterns[hour] = (patterns.timePatterns[hour] || 0) + 1;

    // Update day patterns
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    patterns.dayPatterns[day] = (patterns.dayPatterns[day] || 0) + 1;

    // Update payment method frequency
    if (source) {
      patterns.paymentMethods[source] = (patterns.paymentMethods[source] || 0) + 1;
    }

    // Update trust score
    this.updateTrustScore();

    // Detect risk factors
    this.detectRiskFactors(transaction);

    this.profile!.lastUpdated = new Date();
    await this.save();
  }

  /**
   * Analyze if transaction is anomalous
   */
  async analyzeTransaction(transaction: any): Promise<{
    isAnomalous: boolean;
    reasons: string[];
    riskScore: number;
  }> {
    if (!this.profile) {
      await this.initialize('user_001');
    }

    const reasons: string[] = [];
    let riskScore = 0;

    const { merchant, amount, time, source } = transaction;
    const patterns = this.profile!.patterns;

    // Check amount anomaly
    if (amount > patterns.averageTransaction * 3) {
      reasons.push(`Amount is ${Math.round(amount / patterns.averageTransaction)}x your average`);
      riskScore += 25;
    }

    if (amount > patterns.maxTransaction * 1.5) {
      reasons.push('Highest transaction amount ever');
      riskScore += 20;
    }

    // Check merchant anomaly
    const merchantFrequency = patterns.frequentMerchants[merchant] || 0;
    if (merchantFrequency === 0) {
      reasons.push('First time transaction with this merchant');
      riskScore += 15;
    }

    // Check time anomaly
    const hour = this.extractHour(time);
    const timeFrequency = patterns.timePatterns[hour] || 0;
    if (hour >= 0 && hour < 6 && timeFrequency < 2) {
      reasons.push('Unusual transaction time (late night)');
      riskScore += 20;
    }

    // Check payment method anomaly
    const methodFrequency = patterns.paymentMethods[source] || 0;
    if (methodFrequency === 0) {
      reasons.push('First time using this payment method');
      riskScore += 10;
    }

    // Check velocity (rapid transactions)
    if (this.checkVelocityAnomaly()) {
      reasons.push('Multiple transactions in short time');
      riskScore += 10;
    }

    return {
      isAnomalous: riskScore > 30,
      reasons,
      riskScore: Math.min(riskScore, 100),
    };
  }

  /**
   * Get user's spending insights
   */
  getInsights(): {
    topMerchants: Array<{ name: string; count: number }>;
    topCategories: Array<{ name: string; count: number }>;
    preferredPaymentMethod: string;
    mostActiveTime: string;
    mostActiveDay: string;
    spendingTrend: string;
  } {
    if (!this.profile) {
      return {
        topMerchants: [],
        topCategories: [],
        preferredPaymentMethod: 'Unknown',
        mostActiveTime: 'Unknown',
        mostActiveDay: 'Unknown',
        spendingTrend: 'No data',
      };
    }

    const patterns = this.profile.patterns;

    // Top merchants
    const topMerchants = Object.entries(patterns.frequentMerchants)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Top categories
    const topCategories = Object.entries(patterns.frequentCategories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Preferred payment method
    const preferredPaymentMethod = Object.entries(patterns.paymentMethods)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';

    // Most active time
    const mostActiveHour = Object.entries(patterns.timePatterns)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    const mostActiveTime = mostActiveHour 
      ? `${mostActiveHour}:00 - ${parseInt(mostActiveHour) + 1}:00`
      : 'Unknown';

    // Most active day
    const mostActiveDay = Object.entries(patterns.dayPatterns)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';

    // Spending trend
    const avgSpend = patterns.averageTransaction;
    const spendingTrend = avgSpend > 5000 
      ? 'High spender' 
      : avgSpend > 1000 
      ? 'Moderate spender' 
      : 'Conservative spender';

    return {
      topMerchants,
      topCategories,
      preferredPaymentMethod,
      mostActiveTime,
      mostActiveDay,
      spendingTrend,
    };
  }

  /**
   * Get current profile
   */
  getProfile(): BehavioralProfile | null {
    return this.profile;
  }

  /**
   * Update trust score based on behavior
   */
  private updateTrustScore() {
    if (!this.profile) return;

    let score = 50; // Base score

    // Increase score for consistent behavior
    const txnCount = this.profile.patterns.transactionCount;
    if (txnCount > 50) score += 20;
    else if (txnCount > 20) score += 10;
    else if (txnCount > 10) score += 5;

    // Decrease score for risk factors
    score -= this.profile.riskFactors.length * 5;

    // Ensure score is between 0-100
    this.profile.trustScore = Math.max(0, Math.min(100, score));
  }

  /**
   * Detect risk factors
   */
  private detectRiskFactors(transaction: any) {
    if (!this.profile) return;

    const riskFactors: string[] = [];

    // High value transactions
    if (transaction.amount > 50000) {
      riskFactors.push('High value transactions');
    }

    // Late night activity
    const hour = this.extractHour(transaction.time);
    if (hour >= 0 && hour < 6) {
      riskFactors.push('Late night activity');
    }

    // Update profile risk factors (keep unique)
    this.profile.riskFactors = Array.from(new Set([...this.profile.riskFactors, ...riskFactors]));
  }

  /**
   * Check for velocity anomaly
   */
  private checkVelocityAnomaly(): boolean {
    // In production, check transaction timestamps
    // For demo, return false
    return false;
  }

  /**
   * Extract hour from time string
   */
  private extractHour(timeStr: string): number {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 12;

    let hour = parseInt(match[1]);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return hour;
  }

  /**
   * Save profile to storage
   */
  private async save(): Promise<void> {
    if (!this.profile) return;

    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  /**
   * Clear profile (for testing)
   */
  async clear(): Promise<void> {
    this.profile = null;
    await AsyncStorage.removeItem(this.storageKey);
  }
}

export default new BehavioralProfileService();
