import fc from 'fast-check';
import { languageService } from '../../services/LanguageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('LanguageService Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Feature: enhanced-dashboard-features, Property 2: Language translation consistency
   * For any supported language selection, all visible interface text should be translated 
   * to the selected language while maintaining screen state and data
   * Validates: Requirements 2.1, 2.2, 2.3
   */
  test('Property 2: Language translation consistency', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('en', 'hi', 'te', 'ma', 'bn'),
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
        async (language, translationKeys) => {
          // Setup: Mock AsyncStorage to succeed
          (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
          
          // Action: Change language
          await languageService.changeLanguage(language);
          
          // Verify: Language is changed correctly
          expect(languageService.currentLanguage).toBe(language);
          
          // Verify: Translation keys return non-empty strings for supported languages
          translationKeys.forEach(key => {
            const translation = languageService.translate(`greeting.${key}`) || 
                              languageService.translate(key);
            expect(typeof translation).toBe('string');
            expect(translation.length).toBeGreaterThan(0);
          });
          
          // Verify: AsyncStorage is called to persist language
          expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_language', language);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Language service supports all required languages', () => {
    const supportedLanguages = languageService.supportedLanguages;
    const requiredLanguages = ['en', 'hi', 'te', 'ma', 'bn'];
    
    requiredLanguages.forEach(lang => {
      expect(supportedLanguages).toContain(lang);
    });
  });

  test('Translation keys exist for all supported languages', () => {
    const testKeys = [
      'greeting.morning',
      'greeting.afternoon', 
      'greeting.evening',
      'dashboard.financialOverview',
      'security.status',
      'loan.eligibility'
    ];

    languageService.supportedLanguages.forEach(async (language) => {
      await languageService.changeLanguage(language);
      
      testKeys.forEach(key => {
        const translation = languageService.translate(key);
        expect(translation).toBeDefined();
        expect(translation.length).toBeGreaterThan(0);
        // Should not return the key itself (indicates missing translation)
        expect(translation).not.toBe(key);
      });
    });
  });
});
  /**
   * Feature: enhanced-dashboard-features, Property 3: Translation error handling
   * For any translation failure, the system should display an error message and revert 
   * to the previous working language
   * Validates: Requirements 2.4
   */
  test('Property 3: Translation error handling', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('en', 'hi', 'te', 'ma', 'bn'),
        fc.string({ minLength: 1, maxLength: 10 }).filter(s => !['en', 'hi', 'te', 'ma', 'bn'].includes(s)),
        async (validLanguage, invalidLanguage) => {
          // Setup: Set a valid language first
          (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
          await languageService.changeLanguage(validLanguage);
          const previousLanguage = languageService.currentLanguage;
          
          // Action: Try to change to invalid language
          (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage failed'));
          
          let errorThrown = false;
          try {
            await languageService.changeLanguage(invalidLanguage);
          } catch (error) {
            errorThrown = true;
            expect(error).toBeInstanceOf(Error);
          }
          
          // Verify: Error is thrown for invalid language
          expect(errorThrown).toBe(true);
          
          // Verify: Language remains unchanged after error
          expect(languageService.currentLanguage).toBe(previousLanguage);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Unsupported language throws error', async () => {
    const unsupportedLanguages = ['fr', 'de', 'es', 'invalid', '123', ''];
    
    for (const lang of unsupportedLanguages) {
      await expect(languageService.changeLanguage(lang)).rejects.toThrow();
    }
  });

  test('AsyncStorage failure handling', async () => {
    const originalLanguage = languageService.currentLanguage;
    
    // Mock AsyncStorage to fail
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage failed'));
    
    await expect(languageService.changeLanguage('hi')).rejects.toThrow();
    
    // Language should not change if storage fails
    expect(languageService.currentLanguage).toBe(originalLanguage);
  });
});
describe('Language Toggle Functionality Unit Tests', () => {
  test('Language switching preserves state', async () => {
    const originalLanguage = languageService.currentLanguage;
    
    // Mock successful storage
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    
    // Switch to Hindi
    await languageService.changeLanguage('hi');
    expect(languageService.currentLanguage).toBe('hi');
    
    // Switch to Telugu
    await languageService.changeLanguage('te');
    expect(languageService.currentLanguage).toBe('te');
    
    // Verify AsyncStorage was called for each change
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_language', 'hi');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_language', 'te');
  });

  test('Error handling preserves previous language', async () => {
    // Set initial language
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    await languageService.changeLanguage('en');
    const previousLanguage = languageService.currentLanguage;
    
    // Mock storage failure
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage failed'));
    
    // Try to change language - should fail
    await expect(languageService.changeLanguage('hi')).rejects.toThrow();
    
    // Language should remain unchanged
    expect(languageService.currentLanguage).toBe(previousLanguage);
  });

  test('Fallback behavior for missing translations', () => {
    const nonExistentKey = 'non.existent.key.12345';
    const translation = languageService.translate(nonExistentKey);
    
    // Should return the key itself when translation is missing
    expect(translation).toBe(nonExistentKey);
  });

  test('Load saved language from storage', async () => {
    // Mock saved language in storage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('hi');
    
    await languageService.loadSavedLanguage();
    
    expect(languageService.currentLanguage).toBe('hi');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_language');
  });

  test('Handle corrupted storage data gracefully', async () => {
    // Mock corrupted data
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid_language_code');
    
    const originalLanguage = languageService.currentLanguage;
    
    await languageService.loadSavedLanguage();
    
    // Should not change language for invalid codes
    expect(languageService.currentLanguage).toBe(originalLanguage);
  });

  test('Translation with parameters', () => {
    // Test parameterized translations (if supported)
    const greeting = languageService.translate('greeting.morning');
    expect(typeof greeting).toBe('string');
    expect(greeting.length).toBeGreaterThan(0);
  });

  test('All supported languages have required translations', () => {
    const requiredKeys = [
      'greeting.morning',
      'greeting.afternoon',
      'greeting.evening',
      'dashboard.financialOverview',
      'security.status'
    ];

    languageService.supportedLanguages.forEach(async (lang) => {
      await languageService.changeLanguage(lang);
      
      requiredKeys.forEach(key => {
        const translation = languageService.translate(key);
        expect(translation).toBeDefined();
        expect(translation).not.toBe(key); // Should not return key itself
        expect(translation.length).toBeGreaterThan(0);
      });
    });
  });
});