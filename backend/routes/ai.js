const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const fraudEngine = require('../services/fraudEngine');

/**
 * POST /api/ai/explain
 * Get AI explanation for fraud detection
 */
router.post('/explain', async (req, res) => {
  try {
    const { transaction } = req.body;

    if (!transaction) {
      return res.status(400).json({
        success: false,
        error: 'Transaction data is required'
      });
    }

    // Analyze transaction
    const analysis = fraudEngine.analyze(transaction);

    // Get AI explanation
    const explanation = await geminiService.explainFraud(transaction, analysis);

    res.json({
      success: true,
      data: {
        explanation,
        analysis,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/ai/ask
 * Ask AI a question about transaction
 */
router.post('/ask', async (req, res) => {
  try {
    const { question, transaction, analysis } = req.body;

    if (!question || !transaction) {
      return res.status(400).json({
        success: false,
        error: 'Question and transaction data are required'
      });
    }

    // If analysis not provided, generate it
    const fraudAnalysis = analysis || fraudEngine.analyze(transaction);

    // Get AI answer
    const answer = await geminiService.askQuestion(question, transaction, fraudAnalysis);

    res.json({
      success: true,
      data: {
        question,
        answer,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/ai/generate
 * Generate text using Gemini (for NLP parsing)
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Generate text using Gemini
    const text = await geminiService.generateText(prompt);

    res.json({
      success: true,
      data: {
        text,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
