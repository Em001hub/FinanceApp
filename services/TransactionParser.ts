/**
 * Transaction Parser Service
 * Uses Gemini AI NLP to extract transaction details from SMS/notifications
 */
import { geminiService } from './GeminiService';

export interface ParsedTransaction {
  merchant?: string;
  amount?: number;
  time?: string;
  date?: string;
  source?: string;
  type?: 'debit' | 'credit';
  reference?: string;
  balance?: number;
  confidence: number;
}

class TransactionParserService {
  /**
   * Parse transaction text using Gemini AI
   */
  async parse(text: string): Promise<ParsedTransaction> {
    try {
      // Use Gemini for intelligent parsing
      const prompt = `Extract transaction details from this SMS/notification text. Return ONLY a JSON object with these fields:
{
  "merchant": "merchant name or recipient",
  "amount": numeric amount without currency symbol,
  "time": "time in HH:MM AM/PM format",
  "date": "date in DD-MMM-YY format",
  "source": "payment method (UPI/Card/NetBanking/Wallet)",
  "type": "debit or credit",
  "reference": "transaction ID or reference number",
  "balance": "available balance if mentioned",
  "confidence": confidence score 0-100
}

Text: "${text}"

Return ONLY valid JSON, no explanation.`;

      const response = await geminiService.generateText(prompt);
      
      // Try to parse JSON from response
      const parsed = this.extractJSON(response);
      
      if (parsed) {
        return parsed;
      }

      // Fallback to regex-based parsing
      return this.regexParse(text);
    } catch (error) {
      console.error('Error parsing with Gemini:', error);
      // Fallback to regex parsing
      return this.regexParse(text);
    }
  }

  /**
   * Extract JSON from Gemini response
   */
  private extractJSON(text: string): ParsedTransaction | null {
    try {
      // Remove markdown code blocks if present
      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to find JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Fallback regex-based parsing
   */
  private regexParse(text: string): ParsedTransaction {
    const result: ParsedTransaction = {
      confidence: 60, // Lower confidence for regex parsing
    };

    // Extract amount
    const amountMatch = text.match(/Rs\.?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
    if (amountMatch) {
      result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract merchant/recipient
    const merchantPatterns = [
      /(?:to|from)\s+([A-Za-z0-9\s]+?)(?:\s+via|\s+using|\s+on|\.)/i,
      /paid\s+to\s+([A-Za-z0-9\s]+)/i,
      /received\s+from\s+([A-Za-z0-9\s]+)/i,
    ];

    for (const pattern of merchantPatterns) {
      const match = text.match(pattern);
      if (match) {
        result.merchant = match[1].trim();
        break;
      }
    }

    // Extract payment source
    if (text.toLowerCase().includes('upi')) {
      result.source = 'UPI';
    } else if (text.toLowerCase().includes('card')) {
      result.source = 'Card';
    } else if (text.toLowerCase().includes('netbanking')) {
      result.source = 'NetBanking';
    } else if (text.toLowerCase().includes('wallet')) {
      result.source = 'Wallet';
    }

    // Extract transaction type
    if (text.toLowerCase().includes('debited') || text.toLowerCase().includes('paid')) {
      result.type = 'debit';
    } else if (text.toLowerCase().includes('credited') || text.toLowerCase().includes('received')) {
      result.type = 'credit';
    }

    // Extract date
    const dateMatch = text.match(/(\d{1,2})-([A-Za-z]{3})-(\d{2})/);
    if (dateMatch) {
      result.date = dateMatch[0];
    }

    // Extract time
    const timeMatch = text.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      result.time = timeMatch[0];
    } else {
      // Use current time if not found
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      result.time = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    // Extract reference number
    const refPatterns = [
      /(?:Ref|TxnID|UPI Ref):\s*([A-Z0-9]+)/i,
      /([A-Z0-9]{10,})/,
    ];

    for (const pattern of refPatterns) {
      const match = text.match(pattern);
      if (match) {
        result.reference = match[1];
        break;
      }
    }

    // Extract balance
    const balanceMatch = text.match(/(?:Avl Bal|Balance):\s*Rs\.?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
    if (balanceMatch) {
      result.balance = parseFloat(balanceMatch[1].replace(/,/g, ''));
    }

    return result;
  }

  /**
   * Validate parsed transaction
   */
  validate(parsed: ParsedTransaction): boolean {
    return !!(parsed.amount && parsed.merchant);
  }

  /**
   * Format parsed transaction for display
   */
  format(parsed: ParsedTransaction): string {
    const parts: string[] = [];

    if (parsed.type) {
      parts.push(parsed.type === 'debit' ? 'Paid' : 'Received');
    }

    if (parsed.amount) {
      parts.push(`₹${parsed.amount.toLocaleString('en-IN')}`);
    }

    if (parsed.merchant) {
      parts.push(parsed.type === 'debit' ? `to ${parsed.merchant}` : `from ${parsed.merchant}`);
    }

    if (parsed.source) {
      parts.push(`via ${parsed.source}`);
    }

    if (parsed.time) {
      parts.push(`at ${parsed.time}`);
    }

    return parts.join(' ');
  }
}

export default new TransactionParserService();
