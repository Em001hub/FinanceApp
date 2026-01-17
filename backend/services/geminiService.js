const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDLbZgHc_kuAWlFOV05PAPhbtJ-6vlOF7Q';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  /**
   * Generate fraud explanation using Gemini AI
   */
  async explainFraud(transaction, analysis) {
    const prompt = this.buildFraudPrompt(transaction, analysis);

    // Try real API first
    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      try {
        const response = await axios.post(
          `${this.apiUrl}?key=${this.apiKey}`,
          {
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        if (response.data && response.data.candidates && response.data.candidates[0]) {
          return response.data.candidates[0].content.parts[0].text;
        }
      } catch (error) {
        console.error('Gemini API Error:', error.message);
        // Fall back to mock
      }
    }

    // Fallback to mock response
    return this.getMockExplanation(transaction, analysis);
  }

  /**
   * Answer user question about transaction
   */
  async askQuestion(question, transaction, analysis) {
    const prompt = this.buildQuestionPrompt(question, transaction, analysis);

    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      return this.getMockAnswer(question, transaction, analysis);
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return this.getMockAnswer(question, transaction, analysis);
    }
  }

  /**
   * Build fraud explanation prompt
   */
  buildFraudPrompt(transaction, analysis) {
    return `You are a fraud detection AI assistant for a fintech app. Explain why this transaction was flagged as suspicious in a clear, user-friendly way.

Transaction Details:
- Merchant: ${transaction.merchant}
- Amount: ₹${transaction.amount.toLocaleString('en-IN')}
- Time: ${transaction.time}
- Payment Method: ${transaction.source}

Fraud Analysis:
- Risk Score: ${analysis.riskScore}/100
- Risk Level: ${analysis.riskLevel}
- Reasons: ${analysis.reasons.join(', ')}

Provide a concise explanation (3-4 sentences) that helps the user understand why this transaction is suspicious.`;
  }

  /**
   * Build question prompt
   */
  buildQuestionPrompt(question, transaction, analysis) {
    return `You are a fraud detection AI assistant. A user is asking about a suspicious transaction.

Transaction Details:
- Merchant: ${transaction.merchant}
- Amount: ₹${transaction.amount.toLocaleString('en-IN')}
- Time: ${transaction.time}
- Risk Score: ${analysis.riskScore}/100

User Question: ${question}

Provide a helpful, concise answer (2-3 sentences).`;
  }

  /**
   * Get mock explanation (when API key not configured)
   */
  getMockExplanation(transaction, analysis) {
    return `This transaction was flagged because:

• **High amount**: ₹${transaction.amount.toLocaleString('en-IN')} is significantly above your average spending
• **Unusual timing**: Transaction made at ${transaction.time}, which is outside your normal pattern
• **Risk indicators**: Our AI detected ${analysis.reasons.length} fraud indicators with a risk score of ${analysis.riskScore}/100

${analysis.recommendation}`;
  }

  /**
   * Get mock answer (when API key not configured)
   */
  getMockAnswer(question, transaction, analysis) {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('safe') || lowerQuestion.includes('legitimate')) {
      return `Based on the analysis, this transaction shows ${analysis.riskLevel.toLowerCase()} risk indicators. I recommend verifying with the merchant before confirming it as safe. The risk score of ${analysis.riskScore}/100 suggests caution.`;
    }

    if (lowerQuestion.includes('block') || lowerQuestion.includes('stop')) {
      return `You can block this transaction by clicking "Report Fraud". We'll immediately freeze the payment and notify your bank. This is recommended for transactions with risk scores above 70.`;
    }

    if (lowerQuestion.includes('why') || lowerQuestion.includes('reason')) {
      return `The transaction was flagged due to: ${analysis.reasons.join(', ')}. These patterns are commonly associated with fraudulent activity in our system.`;
    }

    return `I understand your concern about the ${transaction.merchant} transaction. With a risk score of ${analysis.riskScore}/100, I recommend ${analysis.recommendation.toLowerCase()}. Would you like me to explain any specific aspect?`;
  }

  /**
   * Generate text using Gemini (for NLP parsing)
   */
  async generateText(prompt) {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      // Return mock response for parsing
      return this.getMockParseResponse(prompt);
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        return response.data.candidates[0].content.parts[0].text;
      }

      throw new Error('Invalid response from Gemini API');
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return this.getMockParseResponse(prompt);
    }
  }

  /**
   * Get mock parse response (for transaction parsing)
   */
  getMockParseResponse(prompt) {
    // Extract text from prompt
    const textMatch = prompt.match(/Text: "(.+?)"/);
    if (!textMatch) {
      return '{"confidence": 0}';
    }

    const text = textMatch[1];
    
    // Simple regex-based parsing for demo
    const result = {
      merchant: null,
      amount: null,
      time: null,
      date: null,
      source: null,
      type: null,
      reference: null,
      balance: null,
      confidence: 70
    };

    // Extract amount
    const amountMatch = text.match(/Rs\.?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
    if (amountMatch) {
      result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract merchant
    const merchantMatch = text.match(/(?:to|from)\s+([A-Za-z0-9\s]+?)(?:\s+via|\s+using|\s+on|\.)/i);
    if (merchantMatch) {
      result.merchant = merchantMatch[1].trim();
    }

    // Extract source
    if (text.toLowerCase().includes('upi')) result.source = 'UPI';
    else if (text.toLowerCase().includes('card')) result.source = 'Card';

    // Extract type
    if (text.toLowerCase().includes('debited') || text.toLowerCase().includes('paid')) {
      result.type = 'debit';
    } else if (text.toLowerCase().includes('credited')) {
      result.type = 'credit';
    }

    return JSON.stringify(result);
  }
}

module.exports = new GeminiService();
