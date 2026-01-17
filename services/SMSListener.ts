/**
 * SMS Listener Service
 * Monitors incoming SMS for transaction notifications from banks/payment apps
 */
import * as SMS from 'expo-sms';
import { Platform, PermissionsAndroid } from 'react-native';
import TransactionParser from './TransactionParser';

export interface SMSTransaction {
  id: string;
  rawMessage: string;
  sender: string;
  timestamp: Date;
  parsed?: any;
}

class SMSListenerService {
  private listeners: ((transaction: SMSTransaction) => void)[] = [];
  private isListening = false;

  // Bank/Payment app sender IDs to monitor
  private trustedSenders = [
    'HDFCBK',
    'ICICIB',
    'SBIIN',
    'AXISBK',
    'KOTAKB',
    'PAYTM',
    'GPAY',
    'PHONEPE',
    'AMAZONP',
  ];

  /**
   * Request SMS permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'SMS Permission',
            message: 'HackWins needs access to read SMS for transaction monitoring',
            buttonPositive: 'Allow',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Error requesting SMS permission:', error);
        return false;
      }
    }
    return true;
  }

  /**
   * Start listening for SMS
   */
  async startListening(): Promise<boolean> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('SMS permission not granted');
      return false;
    }

    this.isListening = true;
    console.log('✅ SMS Listener started');

    // Note: React Native doesn't have built-in SMS listener
    // In production, use native modules or third-party libraries
    // For demo, we'll simulate SMS monitoring
    this.simulateSMSMonitoring();

    return true;
  }

  /**
   * Stop listening
   */
  stopListening() {
    this.isListening = false;
    console.log('❌ SMS Listener stopped');
  }

  /**
   * Subscribe to SMS transactions
   */
  subscribe(callback: (transaction: SMSTransaction) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Process incoming SMS
   */
  private async processSMS(sender: string, message: string) {
    // Check if sender is trusted
    const isTrusted = this.trustedSenders.some(trusted =>
      sender.toUpperCase().includes(trusted)
    );

    if (!isTrusted) {
      return;
    }

    // Check if message contains transaction keywords
    const transactionKeywords = [
      'debited',
      'credited',
      'paid',
      'received',
      'transaction',
      'upi',
      'transfer',
      'withdrawn',
    ];

    const isTransaction = transactionKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (!isTransaction) {
      return;
    }

    // Create SMS transaction object
    const smsTransaction: SMSTransaction = {
      id: `sms_${Date.now()}`,
      rawMessage: message,
      sender,
      timestamp: new Date(),
    };

    // Parse transaction details using NLP
    try {
      const parsed = await TransactionParser.parse(message);
      smsTransaction.parsed = parsed;
    } catch (error) {
      console.error('Error parsing SMS:', error);
    }

    // Notify all listeners
    this.notifyListeners(smsTransaction);
  }

  /**
   * Notify all subscribers
   */
  private notifyListeners(transaction: SMSTransaction) {
    this.listeners.forEach(callback => {
      try {
        callback(transaction);
      } catch (error) {
        console.error('Error in SMS listener callback:', error);
      }
    });
  }

  /**
   * Simulate SMS monitoring (for demo purposes)
   */
  private simulateSMSMonitoring() {
    // Simulate receiving transaction SMS every 30 seconds
    const mockSMS = [
      {
        sender: 'HDFCBK',
        message: 'Rs.2,499.00 debited from A/c XX1234 on 17-Jan-26 to Amazon via UPI. Avl Bal: Rs.45,678.00',
      },
      {
        sender: 'PAYTM',
        message: 'Rs.389 paid to Swiggy using Paytm. Your transaction is successful. TxnID: PTM123456789',
      },
      {
        sender: 'GPAY',
        message: 'You paid Rs.32,000 to Flipkart Seller via Google Pay. UPI Ref: 402345678901',
      },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (!this.isListening) {
        clearInterval(interval);
        return;
      }

      const sms = mockSMS[index % mockSMS.length];
      this.processSMS(sms.sender, sms.message);
      index++;
    }, 30000); // Every 30 seconds
  }

  /**
   * Get listening status
   */
  isActive(): boolean {
    return this.isListening;
  }
}

export default new SMSListenerService();
