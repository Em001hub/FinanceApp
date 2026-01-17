const GEMINI_API_KEY = "AIzaSyDLbZgHc_kuAWlFOV05PAPhbtJ-6vlOF7Q";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private static instance: GeminiService;

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }

  async parseWithGemini(text: string): Promise<string> {
    try {
      const prompt = `Parse and analyze the following text for financial insights: ${text}`;
      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error parsing with Gemini:', error);
      throw error;
    }
  }

  async generateFinancialAdvice(userProfile: any): Promise<string> {
    try {
      const prompt = `Based on the following user profile, provide personalized financial advice:
      Income: ${userProfile.monthlyIncome}
      Expenses: ${userProfile.monthlyExpenses}
      Credit Score: ${userProfile.creditScore}
      Risk Tolerance: ${userProfile.riskTolerance}
      
      Provide specific, actionable advice in 2-3 sentences.`;
      
      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error generating financial advice:', error);
      return "Unable to generate personalized advice at this time. Please try again later.";
    }
  }

  async explainFraud(fraudAlert: any): Promise<string> {
    try {
      const prompt = `Explain this suspicious transaction in simple terms:
      Merchant: ${fraudAlert.merchant}
      Amount: ₹${fraudAlert.amount}
      Time: ${fraudAlert.time}
      Risk Score: ${fraudAlert.riskScore}/100
      
      Provide a clear explanation of why this transaction was flagged and what the user should do.`;
      
      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error explaining fraud:', error);
      return "This transaction was flagged due to unusual patterns. Please verify if you made this transaction. If not, report it as fraud immediately.";
    }
  }

  async askQuestion(question: string, context: any): Promise<string> {
    try {
      const prompt = `User question: ${question}
      
      Context: Transaction from ${context.merchant} for ₹${context.amount} at ${context.time}
      Risk Score: ${context.riskScore}/100
      
      Provide a helpful answer about this transaction or fraud detection in general.`;
      
      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error answering question:', error);
      return "I'm having trouble processing your question right now. Please try again later.";
    }
  }
}

export const geminiService = GeminiService.getInstance();