const express = require('express');
const router = express.Router();

// Mock transaction database
const transactions = [
  {
    id: 'txn_001',
    merchant: 'Amazon',
    amount: 2499,
    time: '10:42 AM',
    source: 'UPI',
    riskScore: 15,
    riskLevel: 'Low',
    status: 'Completed',
    date: '2026-01-16',
    category: 'Shopping'
  },
  {
    id: 'txn_002',
    merchant: 'Swiggy',
    amount: 389,
    time: '1:22 PM',
    source: 'Card',
    riskScore: 10,
    riskLevel: 'Low',
    status: 'Completed',
    date: '2026-01-16',
    category: 'Food'
  },
  {
    id: 'txn_003',
    merchant: 'Flipkart',
    amount: 32000,
    time: '2:14 AM',
    source: 'UPI',
    riskScore: 87,
    riskLevel: 'High',
    status: 'Suspicious',
    date: '2026-01-16',
    category: 'Shopping'
  }
];

/**
 * GET /api/transactions
 * Get all transactions
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/transactions/:id
 * Get transaction by ID
 */
router.get('/:id', (req, res) => {
  try {
    const transaction = transactions.find(t => t.id === req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/transactions
 * Create new transaction
 */
router.post('/', (req, res) => {
  try {
    const { merchant, amount, time, source, category } = req.body;

    const newTransaction = {
      id: `txn_${Date.now()}`,
      merchant,
      amount,
      time,
      source,
      category: category || 'Other',
      riskScore: 0,
      riskLevel: 'Low',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    transactions.push(newTransaction);

    res.status(201).json({
      success: true,
      data: newTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/transactions/:id/status
 * Update transaction status
 */
router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const transaction = transactions.find(t => t.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    transaction.status = status;

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
