/**
 * Fraud Detection ML Engine (Simulated)
 * This simulates a machine learning model for fraud detection
 */

class FraudEngine {
  /**
   * Analyze transaction for fraud
   * @param {Object} transaction - Transaction data
   * @returns {Object} Fraud analysis result
   */
  analyze(transaction) {
    const { merchant, amount, time, source, userId } = transaction;
    
    let riskScore = 0;
    const reasons = [];
    const factors = [];

    // Factor 1: High Amount (weight: 30)
    if (amount > 20000) {
      riskScore += 30;
      reasons.push('High amount transaction');
      factors.push({
        factor: 'Amount',
        value: `₹${amount.toLocaleString('en-IN')}`,
        risk: 'High',
        weight: 30
      });
    } else if (amount > 10000) {
      riskScore += 15;
      reasons.push('Moderate amount transaction');
      factors.push({
        factor: 'Amount',
        value: `₹${amount.toLocaleString('en-IN')}`,
        risk: 'Medium',
        weight: 15
      });
    }

    // Factor 2: Time of Transaction (weight: 25)
    const hour = this.parseTime(time);
    if (hour >= 0 && hour < 5) {
      riskScore += 25;
      reasons.push(`Late night transaction (${time})`);
      factors.push({
        factor: 'Time',
        value: time,
        risk: 'High',
        weight: 25
      });
    } else if (hour >= 22 || hour < 6) {
      riskScore += 12;
      reasons.push(`Unusual time (${time})`);
      factors.push({
        factor: 'Time',
        value: time,
        risk: 'Medium',
        weight: 12
      });
    }

    // Factor 3: New Merchant (weight: 20)
    if (this.isNewMerchant(merchant, userId)) {
      riskScore += 20;
      reasons.push('New merchant');
      factors.push({
        factor: 'Merchant',
        value: merchant,
        risk: 'Medium',
        weight: 20
      });
    }

    // Factor 4: Payment Source (weight: 15)
    if (source === 'UPI' && amount > 25000) {
      riskScore += 15;
      reasons.push('High UPI transaction');
      factors.push({
        factor: 'Payment Method',
        value: source,
        risk: 'Medium',
        weight: 15
      });
    }

    // Factor 5: Velocity Check (weight: 10)
    if (this.checkVelocity(userId)) {
      riskScore += 10;
      reasons.push('Multiple transactions in short time');
      factors.push({
        factor: 'Velocity',
        value: 'High frequency',
        risk: 'Medium',
        weight: 10
      });
    }

    // Determine risk level
    const riskLevel = this.getRiskLevel(riskScore);

    return {
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      reasons,
      factors,
      recommendation: this.getRecommendation(riskLevel),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Parse time string to hour
   */
  parseTime(timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 12;
    
    let hour = parseInt(match[1]);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    return hour;
  }

  /**
   * Check if merchant is new (simulated)
   */
  isNewMerchant(merchant, userId) {
    // In production, check against user's transaction history
    const knownMerchants = ['Amazon', 'Swiggy', 'Zomato', 'Netflix'];
    return !knownMerchants.includes(merchant);
  }

  /**
   * Check transaction velocity (simulated)
   */
  checkVelocity(userId) {
    // In production, check transaction frequency from database
    return Math.random() > 0.7; // 30% chance of high velocity
  }

  /**
   * Get risk level from score
   */
  getRiskLevel(score) {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  /**
   * Get recommendation based on risk level
   */
  getRecommendation(riskLevel) {
    switch (riskLevel) {
      case 'High':
        return 'Block transaction and verify with user immediately';
      case 'Medium':
        return 'Request additional verification before processing';
      case 'Low':
        return 'Process transaction normally';
      default:
        return 'Review transaction';
    }
  }

  /**
   * Generate detailed fraud report
   */
  generateReport(transaction, analysis) {
    return {
      transactionId: transaction.id || `txn_${Date.now()}`,
      merchant: transaction.merchant,
      amount: transaction.amount,
      time: transaction.time,
      source: transaction.source,
      analysis: {
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        reasons: analysis.reasons,
        factors: analysis.factors,
        recommendation: analysis.recommendation
      },
      mlModel: {
        version: '1.0.0',
        algorithm: 'Rule-based + Heuristics',
        confidence: this.calculateConfidence(analysis.factors.length)
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate model confidence
   */
  calculateConfidence(factorCount) {
    return Math.min(60 + (factorCount * 10), 95);
  }
}

module.exports = new FraudEngine();
