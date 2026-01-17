// API service for loan operations
import { Loan, LoanApplication, User } from '../models/LoanModels';

class LoanService {
  private baseURL = 'https://api.example.com';

  async getLoanApplications(): Promise<LoanApplication[]> {
    try {
      const response = await fetch(`${this.baseURL}/applications`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      throw error;
    }
  }

  async submitLoanApplication(application: LoanApplication): Promise<LoanApplication> {
    try {
      const response = await fetch(`${this.baseURL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting loan application:', error);
      throw error;
    }
  }

  async getUserLoans(userId: string): Promise<Loan[]> {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/loans`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user loans:', error);
      throw error;
    }
  }
}

export default new LoanService();
