export interface SIPResult {
  monthlyInvestment: number;
  totalInvestment: number;
  expectedReturns: number;
  maturityAmount: number;
  yearlyBreakdown: YearlyData[];
}

export interface YearlyData {
  year: number;
  invested: number;
  value: number;
  returns: number;
}

export class FinancialUtils {
  static formatCurrency(amount: number, currency: string = 'INR'): string {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: currency
    });
  }

  static calculateSIP(
    monthlyAmount: number,
    annualReturnRate: number,
    years: number
  ): SIPResult {
    const monthlyRate = annualReturnRate / 12 / 100;
    const totalMonths = years * 12;
    
    // Calculate maturity amount using SIP formula
    const maturityAmount = monthlyAmount * 
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const totalInvestment = monthlyAmount * totalMonths;
    const expectedReturns = maturityAmount - totalInvestment;
    
    // Calculate yearly breakdown
    const yearlyBreakdown: YearlyData[] = [];
    for (let year = 1; year <= years; year++) {
      const monthsCompleted = year * 12;
      const investedTillYear = monthlyAmount * monthsCompleted;
      const valueTillYear = monthlyAmount * 
        (((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate));
      const returnsTillYear = valueTillYear - investedTillYear;
      
      yearlyBreakdown.push({
        year,
        invested: investedTillYear,
        value: valueTillYear,
        returns: returnsTillYear
      });
    }

    return {
      monthlyInvestment: monthlyAmount,
      totalInvestment,
      expectedReturns,
      maturityAmount,
      yearlyBreakdown
    };
  }

  static calculateLoanEMI(
    principal: number,
    annualInterestRate: number,
    tenureInYears: number
  ): number {
    const monthlyRate = annualInterestRate / 12 / 100;
    const totalMonths = tenureInYears * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    return Math.round(emi);
  }

  static calculateTaxSavings(investment: number, taxRate: number = 30): number {
    const maxDeduction = 150000; // Section 80C limit
    const eligibleAmount = Math.min(investment, maxDeduction);
    return eligibleAmount * (taxRate / 100);
  }

  static calculateCreditUtilization(usedCredit: number, totalCredit: number): number {
    if (totalCredit === 0) return 0;
    return Math.round((usedCredit / totalCredit) * 100);
  }

  static calculateSavingsRatio(income: number, expenses: number): number {
    if (income === 0) return 0;
    const savings = income - expenses;
    return Math.round((savings / income) * 100);
  }

  static getRiskCategory(score: number): 'Low' | 'Moderate' | 'High' {
    if (score <= 30) return 'Low';
    if (score <= 70) return 'Moderate';
    return 'High';
  }

  static getCreditScoreCategory(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  }

  static suggestOptimalSIP(
    monthlyIncome: number,
    monthlyExpenses: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  ): number {
    const surplus = monthlyIncome - monthlyExpenses;
    const emergencyFund = monthlyExpenses * 6; // 6 months emergency fund
    
    let investmentPercentage: number;
    switch (riskTolerance) {
      case 'conservative':
        investmentPercentage = 0.15; // 15% of surplus
        break;
      case 'moderate':
        investmentPercentage = 0.25; // 25% of surplus
        break;
      case 'aggressive':
        investmentPercentage = 0.40; // 40% of surplus
        break;
    }
    
    const suggestedAmount = surplus * investmentPercentage;
    return Math.max(1000, Math.round(suggestedAmount / 500) * 500); // Minimum ₹1000, rounded to nearest ₹500
  }
}