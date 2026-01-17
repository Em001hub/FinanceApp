// Security and Transaction models
export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  time: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  flagged: boolean;
  source?: string;
}

export interface FraudAlert {
  transactionId: string;
  merchant: string;
  amount: number;
  time: string;
  riskScore: number;
  reasons: string[];
  status: 'pending' | 'confirmed' | 'reported';
}

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
