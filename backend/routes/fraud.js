const express = require('express');
const router = express.Router();
const fraudEngine = require('../services/fraudEngine');
const twilioService = require('../services/twilioService');

/**
 * POST /api/fraud/analyze
 * Analyze transaction for fraud
 */
router.post('/analyze', async (req, res) => {
  try {
    const transaction = req.body;

    // Validate input
    if (!transaction.merchant || !transaction.amount || !transaction.time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: merchant, amount, time'
      });
    }

    // Run fraud analysis
    const analysis = fraudEngine.analyze(transaction);

    // Generate detailed report
    const report = fraudEngine.generateReport(transaction, analysis);

    // Send SMS alert if high risk fraud detected
    if (analysis.isFraud && analysis.riskScore >= 70 && transaction.userPhone) {
      await twilioService.sendFraudAlert(transaction.userPhone, {
        merchant: transaction.merchant,
        amount: transaction.amount,
        time: transaction.time,
        riskScore: analysis.riskScore
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/fraud/report
 * Report transaction as fraud
 */
router.post('/report', async (req, res) => {
  try {
    const { transactionId, reason, userId, phoneNumber } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required'
      });
    }

    // In production, save to database
    const fraudReport = {
      id: `fraud_${Date.now()}`,
      transactionId,
      reason: reason || 'User reported as fraud',
      userId: userId || 'anonymous',
      status: 'Reported',
      reportedAt: new Date().toISOString(),
      action: 'Transaction blocked and under investigation'
    };

    // Send alerts via multiple channels
    if (phoneNumber) {
      // Send WhatsApp alert
      const whatsappService = require('../services/whatsappService');
      await whatsappService.sendFraudAlert(phoneNumber, fraudReport);
      
      // Send SMS alert via Twilio
      await twilioService.sendSMS(phoneNumber, 
        `🚨 Fraud Report Confirmed\n\nYour fraud report has been received and is under investigation.\n\nReport ID: ${fraudReport.id}\n\n- HackWins Security`
      );
    }

    res.json({
      success: true,
      message: 'Fraud reported successfully',
      data: fraudReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/fraud/verify
 * Verify transaction as legitimate
 */
router.post('/verify', (req, res) => {
  try {
    const { transactionId, userId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required'
      });
    }

    // In production, update database
    const verification = {
      id: `verify_${Date.now()}`,
      transactionId,
      userId: userId || 'anonymous',
      status: 'Verified',
      verifiedAt: new Date().toISOString(),
      action: 'Transaction marked as legitimate'
    };

    res.json({
      success: true,
      message: 'Transaction verified successfully',
      data: verification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/fraud/stats
 * Get fraud statistics
 */
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalTransactions: 150,
      suspiciousTransactions: 12,
      blockedTransactions: 3,
      verifiedTransactions: 145,
      fraudRate: 2.0,
      averageRiskScore: 23,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
