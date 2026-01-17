const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Validate credentials format
    const isValidAccountSid = this.accountSid && this.accountSid.startsWith('AC');
    const hasAuthToken = this.authToken && this.authToken !== 'your_auth_token_here';
    const hasPhoneNumber = this.phoneNumber && this.phoneNumber !== '+1234567890';
    
    if (isValidAccountSid && hasAuthToken && hasPhoneNumber) {
      try {
        this.client = twilio(this.accountSid, this.authToken);
        this.enabled = true;
        console.log('✅ Twilio service initialized');
      } catch (error) {
        this.enabled = false;
        console.log('⚠️  Twilio initialization failed:', error.message);
        console.log('⚠️  SMS alerts disabled');
      }
    } else {
      this.enabled = false;
      console.log('⚠️  Twilio credentials not configured - SMS alerts disabled');
      if (!isValidAccountSid) {
        console.log('   → Account SID must start with "AC"');
      }
      if (!hasAuthToken) {
        console.log('   → Auth Token not configured');
      }
      if (!hasPhoneNumber) {
        console.log('   → Phone Number not configured');
      }
    }
  }

  /**
   * Send SMS alert for fraud detection
   */
  async sendFraudAlert(phoneNumber, fraudData) {
    if (!this.enabled) {
      console.log('Twilio not enabled - skipping SMS');
      return { success: false, message: 'Twilio not configured' };
    }

    try {
      const message = `🚨 FRAUD ALERT
Suspicious transaction detected!

Merchant: ${fraudData.merchant}
Amount: ₹${fraudData.amount.toLocaleString('en-IN')}
Time: ${fraudData.time}
Risk Score: ${fraudData.riskScore}/100

If this wasn't you, report immediately via the app.

- HackWins Security`;

      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });

      console.log(`✅ Fraud alert SMS sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('❌ Failed to send fraud alert SMS:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS for loan approval
   */
  async sendLoanApprovalSMS(phoneNumber, loanData) {
    if (!this.enabled) {
      console.log('Twilio not enabled - skipping SMS');
      return { success: false, message: 'Twilio not configured' };
    }

    try {
      const message = `🎉 LOAN APPROVED!

Congratulations! Your loan has been approved.

Loan Amount: ₹${loanData.amount.toLocaleString('en-IN')}
Interest Rate: ${loanData.interestRate}% p.a.
Tenure: ${loanData.tenure} months
Monthly EMI: ₹${loanData.emi.toLocaleString('en-IN')}

Download your sanction letter from the app.

- HackWins Loans`;

      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });

      console.log(`✅ Loan approval SMS sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('❌ Failed to send loan approval SMS:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS for KYC verification
   */
  async sendKYCVerificationSMS(phoneNumber, otp) {
    if (!this.enabled) {
      console.log('Twilio not enabled - skipping SMS');
      return { success: false, message: 'Twilio not configured' };
    }

    try {
      const message = `Your HackWins verification code is: ${otp}

This code will expire in 10 minutes.
Do not share this code with anyone.

- HackWins Security`;

      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });

      console.log(`✅ KYC verification SMS sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('❌ Failed to send KYC SMS:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send WhatsApp alert (requires Twilio WhatsApp sandbox or approved number)
   */
  async sendWhatsAppAlert(phoneNumber, message) {
    if (!this.enabled) {
      console.log('Twilio not enabled - skipping WhatsApp');
      return { success: false, message: 'Twilio not configured' };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: `whatsapp:${this.phoneNumber}`,
        to: `whatsapp:${phoneNumber}`
      });

      console.log(`✅ WhatsApp alert sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('❌ Failed to send WhatsApp alert:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send generic SMS notification
   */
  async sendSMS(phoneNumber, message) {
    if (!this.enabled) {
      console.log('Twilio not enabled - skipping SMS');
      return { success: false, message: 'Twilio not configured' };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });

      console.log(`✅ SMS sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('❌ Failed to send SMS:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new TwilioService();
