const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilioService');

/**
 * POST /api/notifications/sms
 * Send SMS notification
 */
router.post('/sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    const result = await twilioService.sendSMS(phoneNumber, message);

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/fraud-alert
 * Send fraud alert SMS
 */
router.post('/fraud-alert', async (req, res) => {
  try {
    const { phoneNumber, fraudData } = req.body;

    if (!phoneNumber || !fraudData) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and fraud data are required'
      });
    }

    const result = await twilioService.sendFraudAlert(phoneNumber, fraudData);

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/loan-approval
 * Send loan approval SMS
 */
router.post('/loan-approval', async (req, res) => {
  try {
    const { phoneNumber, loanData } = req.body;

    if (!phoneNumber || !loanData) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and loan data are required'
      });
    }

    const result = await twilioService.sendLoanApprovalSMS(phoneNumber, loanData);

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/kyc-otp
 * Send KYC verification OTP
 */
router.post('/kyc-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await twilioService.sendKYCVerificationSMS(phoneNumber, otp);

    res.json({
      success: result.success,
      otp: result.success ? otp : null, // In production, store OTP in DB, don't return it
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/whatsapp
 * Send WhatsApp notification
 */
router.post('/whatsapp', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    const result = await twilioService.sendWhatsAppAlert(phoneNumber, message);

    res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/notifications/test
 * Test Twilio configuration
 */
router.get('/test', (req, res) => {
  const isConfigured = twilioService.enabled;
  
  res.json({
    success: true,
    twilioConfigured: isConfigured,
    message: isConfigured 
      ? 'Twilio is configured and ready' 
      : 'Twilio credentials not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to .env'
  });
});

module.exports = router;
