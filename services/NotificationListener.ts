/**
 * Notification Listener Service
 * Monitors app notifications for transaction alerts from payment apps
 * 
 * EXPO GO COMPATIBLE VERSION
 * This version does NOT import expo-notifications to avoid Expo Go errors
 * Full notification functionality requires a development build
 */

export interface NotificationTransaction {
  id: string;
  title: string;
  body: string;
  app: string;
  timestamp: Date;
  parsed?: any;
}

class NotificationListenerService {
  private listeners: ((transaction: NotificationTransaction) => void)[] = [];
  private isListening = false;

  /**
   * Request notification permissions
   * Demo mode for Expo Go compatibility
   */
  async requestPermissions(): Promise<boolean> {
    console.log('[NotificationListener] Demo mode - permissions granted');
    return true;
  }

  /**
   * Start listening for notifications
   * Demo mode for Expo Go compatibility
   */
  async startListening(): Promise<boolean> {
    this.isListening = true;
    console.log('✅ Notification Listener started (demo mode - Expo Go compatible)');
    return true;
  }

  /**
   * Stop listening
   */
  stopListening() {
    this.isListening = false;
    console.log('❌ Notification Listener stopped');
  }

  /**
   * Subscribe to notification transactions
   */
  subscribe(callback: (transaction: NotificationTransaction) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Simulate a test notification (for demo purposes)
   */
  async simulateNotification(title: string, body: string, app: string = 'GPay') {
    const notifTransaction: NotificationTransaction = {
      id: `notif_${Date.now()}`,
      title,
      body,
      app,
      timestamp: new Date(),
    };

    console.log('[NotificationListener] Simulated notification:', notifTransaction);
    this.notifyListeners(notifTransaction);
  }

  /**
   * Notify all subscribers
   */
  private notifyListeners(transaction: NotificationTransaction) {
    this.listeners.forEach(callback => {
      try {
        callback(transaction);
      } catch (error) {
        console.error('Error in notification listener callback:', error);
      }
    });
  }

  /**
   * Get listening status
   */
  isActive(): boolean {
    return this.isListening;
  }
}

export default new NotificationListenerService();
