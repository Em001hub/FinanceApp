// Loan models and types
export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  createdAt: Date;
}

export interface LoanApplication {
  id: string;
  loanAmount: number;
  purpose: string;
  employmentStatus: string;
  annualIncome: number;
  creditScore: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileComplete: boolean;
  kycVerified?: boolean;
  kycId?: string;
  kycVerifiedAt?: Date;
}

export interface LoanOffer {
  id: string;
  userId: string;
  loanAmount: number;
  interestRate: number;
  emi: number;
  tenure: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'under_negotiation';
  createdAt: Date;
}
