/**
 * WhatsApp Alert Service
 * Sends fraud alerts via WhatsApp (Mock implementation)
 * In production, integrate with Twilio WhatsApp API or WhatsApp Business API
 */

class WhatsAppService {
  /**
   * Send fraud alert via WhatsApp
   * @param {string} phoneNumber - Recipient phone number
   * @param {Object} fraudReport - Fraud report details
   */
  async sendFraudAlert(phoneNumber, fraudReport) {
    try {
      console.log('📱 Sending WhatsApp alert to:', phoneNumber);

      // Format message
      const message = this.formatFraudAlert(fraudReport);

      // In production, use Twilio or WhatsApp Business API
      // Example with Twilio:
      // const client = require('twilio')(accountSid, authToken);
      // await client.messages.create({
      //   from: 'whatsapp:+14155238886',
      //   to: `whatsapp:${phoneNumber}`,
      //   body: message
      // });

      // Mock implementation - log to console
      console.log('WhatsApp Message:');
      console.log('─────────────────────────────');
      console.log(message);
      console.log('─────────────────────────────');

      return {
        success: true,
        messageId: `wa_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending WhatsApp alert:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send transaction verification request
   */
  async sendVerificationRequest(phoneNumber, transaction) {
    try {
      console.log('📱 Sending verification request to:', phoneNumber);

      const message = this.formatVerificationRequest(transaction);

      console.log('WhatsApp Message:');
      console.log('─────────────────────────────');
      console.log(message);
      console.log('─────────────────────────────');

      return {
        success: true,
        messageId: `wa_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending verification request:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send fraud report confirmation
   */
  async sendReportConfirmation(phoneNumber, reportId) {
    try {
      console.log('📱 Sending report confirmation to:', phoneNumber);

      const message = `🛡️ *HackWins Security Alert*

Your fraud report has been received.

Report ID: ${reportId}
Status: Under Investigation
Action: Transaction blocked

Our security team will review this case within 24 hours.

You will receive updates via WhatsApp.

Stay safe! 🔒`;

      console.log('WhatsApp Message:');
      console.log('─────────────────────────────');
      console.log(message);
      console.log('─────────────────────────────');

      return {
        success: true,
        messageId: `wa_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending confirmation:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Format fraud alert message
   */
  formatFraudAlert(fraudReport) {
    return `🚨 *FRAUD ALERT* 🚨

Suspicious transaction detected!

Transaction ID: ${fraudReport.transactionId}
Status: ${fraudReport.status}
Reported: ${new Date(fraudReport.reportedAt).toLocaleString()}

Reason: ${fraudReport.reason}

Action Taken: ${fraudReport.action}

If this was you, please verify in the app.
If not, your account is now protected.

Reply HELP for assistance.

HackWins Security Team 🛡️`;
  }

  /**
   * Format verification request message
   */
  formatVerificationRequest(transaction) {
    return `⚠️ *Transaction Verification Required*

We detected an unusual transaction:

Merchant: ${transaction.merchant}
Amount: ₹${transaction.amount.toLocaleString('en-IN')}
Time: ${transaction.time}
Risk Score: ${transaction.riskScore}/100

Was this you?

Reply:
✅ YES - To confirm
❌ NO - To report fraud

Or verify in the HackWins app.

HackWins Security 🔒`;
  }

  /**
   * Setup Twilio (for production)
   * Uncomment and configure when ready to use
   */
  /*
  setupTwilio() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      console.warn('Twilio credentials not configured');
      return null;
    }

    const client = require('twilio')(accountSid, authToken);
    return client;
  }
  */
}

module.exports = new WhatsAppService();
