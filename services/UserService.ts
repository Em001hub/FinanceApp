import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScore: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentGoals: string[];
  transactionHistory: Transaction[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: NotificationSettings;
  theme: 'light' | 'dark';
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  securityAlerts: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense' | 'investment';
  category: string;
  date: Date;
  description: string;
}

class UserService {
  private static instance: UserService;
  private userProfile: UserProfile | null = null;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUserProfile(): Promise<UserProfile | null> {
    if (this.userProfile) {
      return this.userProfile;
    }

    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      if (profileData) {
        this.userProfile = JSON.parse(profileData);
        return this.userProfile;
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }

    return null;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      this.userProfile = profile;
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }

  async getUserName(): Promise<string | null> {
    try {
      const name = await AsyncStorage.getItem('user_name');
      return name;
    } catch (error) {
      console.error('Failed to get user name:', error);
      return null;
    }
  }

  async saveUserName(name: string): Promise<void> {
    try {
      await AsyncStorage.setItem('user_name', name);
      if (this.userProfile) {
        this.userProfile.name = name;
        await this.saveUserProfile(this.userProfile);
      }
    } catch (error) {
      console.error('Failed to save user name:', error);
      throw error;
    }
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const profile = await this.getUserProfile();
    if (profile) {
      profile.preferences = { ...profile.preferences, ...preferences };
      await this.saveUserProfile(profile);
    }
  }

  // Mock data for development
  getMockUserProfile(): UserProfile {
    return {
      id: 'user_123',
      name: 'Ritesh Kumar',
      email: 'ritesh@example.com',
      phoneNumber: '+91 9876543210',
      monthlyIncome: 50000,
      monthlyExpenses: 35000,
      creditScore: 750,
      riskTolerance: 'moderate',
      investmentGoals: ['retirement', 'house', 'emergency_fund'],
      transactionHistory: [
        {
          id: 'txn_1',
          amount: 50000,
          type: 'income',
          category: 'salary',
          date: new Date('2024-01-01'),
          description: 'Monthly salary'
        },
        {
          id: 'txn_2',
          amount: 15000,
          type: 'expense',
          category: 'rent',
          date: new Date('2024-01-02'),
          description: 'House rent'
        },
        {
          id: 'txn_3',
          amount: 5000,
          type: 'investment',
          category: 'mutual_fund',
          date: new Date('2024-01-03'),
          description: 'SIP investment'
        }
      ],
      preferences: {
        language: 'en',
        currency: 'INR',
        notifications: {
          pushNotifications: true,
          emailNotifications: true,
          smsNotifications: false,
          securityAlerts: true
        },
        theme: 'light'
      }
    };
  }

  async initializeMockData(): Promise<void> {
    const existingProfile = await this.getUserProfile();
    if (!existingProfile) {
      const mockProfile = this.getMockUserProfile();
      await this.saveUserProfile(mockProfile);
      await this.saveUserName(mockProfile.name);
    }
  }
}

export const userService = UserService.getInstance();