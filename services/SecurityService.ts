// Security and Fraud Detection Service
import { Transaction, FraudAlert } from '../models/SecurityModels';

class SecurityService {
  // Use your PC's IP address instead of localhost for mobile access
  // Replace with your actual IP from ipconfig
  private baseURL = 'http://192.168.0.152:3000/api';

  // Get transactions from API
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(`${this.baseURL}/transactions`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.map((txn: any) => ({
          id: txn.id,
          merchant: txn.merchant,
          amount: txn.amount,
          time: txn.time,
          riskLevel: txn.riskLevel,
          riskScore: txn.riskScore,
          flagged: txn.status === 'Suspicious',
          source: txn.source,
        }));
      }
      
      return this.getMockTransactions();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return this.getMockTransactions();
    }
  }

  // Mock transactions data (fallback)
  getMockTransactions(): Transaction[] {
    return [
      {
        id: '1',
        merchant: 'Amazon',
        amount: 2499,
        time: '10:42 AM',
        riskLevel: 'Low',
        riskScore: 15,
        flagged: false,
        source: 'UPI',
      },
      {
        id: '2',
        merchant: 'Swiggy',
        amount: 389,
        time: '1:22 PM',
        riskLevel: 'Low',
        riskScore: 10,
        flagged: false,
        source: 'Card',
      },
      {
        id: '3',
        merchant: 'Flipkart',
        amount: 32000,
        time: '2:14 AM',
        riskLevel: 'High',
        riskScore: 87,
        flagged: true,
        source: 'UPI',
      },
    ];
  }

  // Analyze transaction for fraud
  async analyzeFraud(transaction: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/fraud/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing fraud:', error);
      return null;
    }
  }

  // Get fraud alert for flagged transaction
  async getFraudAlert(): Promise<FraudAlert> {
    const transaction = {
      id: 'txn_003',
      merchant: 'Flipkart',
      amount: 32000,
      time: '2:14 AM',
      source: 'UPI',
      userId: 'user_001'
    };

    try {
      const analysis = await this.analyzeFraud(transaction);
      
      if (analysis) {
        return {
          transactionId: transaction.id,
          merchant: transaction.merchant,
          amount: transaction.amount,
          time: transaction.time,
          riskScore: analysis.analysis.riskScore,
          reasons: analysis.analysis.reasons,
          status: 'pending',
        };
      }
    } catch (error) {
      console.error('Error getting fraud alert:', error);
    }

    // Fallback to mock data
    return {
      transactionId: '3',
      merchant: 'Flipkart',
      amount: 32000,
      time: '2:14 AM',
      riskScore: 87,
      reasons: [
        'High amount transaction',
        'New merchant',
        'Late night transaction (2:14 AM)',
        'Unusual spending pattern',
      ],
      status: 'pending',
    };
  }

  // Simulate fraud detection logic
  analyzeFraudRisk(transaction: Transaction): string[] {
    const reasons: string[] = [];
    
    if (transaction.amount > 10000) {
      reasons.push('High amount transaction');
    }
    
    const hour = parseInt(transaction.time.split(':')[0]);
    if (hour >= 0 && hour < 6) {
      reasons.push(`Late night transaction (${transaction.time})`);
    }
    
    if (transaction.riskScore > 70) {
      reasons.push('Unusual spending pattern');
    }
    
    return reasons;
  }

  // Mark transaction as safe
  async markAsSafe(transactionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/fraud/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, userId: 'user_001' }),
      });
      const data = await response.json();
      
      return data.success;
    } catch (error) {
      console.error('Error marking as safe:', error);
      // Return true for demo purposes when backend is not available
      console.log('Backend not available, simulating success for demo');
      return true;
    }
  }

  // Report fraud
  async reportFraud(transactionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/fraud/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transactionId, 
          userId: 'user_001',
          reason: 'User reported as fraudulent'
        }),
      });
      const data = await response.json();
      
      return data.success;
    } catch (error) {
      console.error('Error reporting fraud:', error);
      // Return true for demo purposes when backend is not available
      console.log('Backend not available, simulating success for demo');
      return true;
    }
  }
}

export default new SecurityService();
