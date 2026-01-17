import React from 'react';
import { render } from '@testing-library/react-native';
import fc from 'fast-check';
import { PersonalizedGreeting } from '../../components/PersonalizedGreeting';
import { TimeUtils } from '../../utils/TimeUtils';

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'greeting.morning': 'Good Morning',
        'greeting.afternoon': 'Good Afternoon',
        'greeting.evening': 'Good Evening',
        'greeting.subtitle': 'Your Financial Command Center'
      };
      return translations[key] || key;
    }
  })
}));

// Mock user service
jest.mock('../../services/UserService', () => ({
  userService: {
    getUserName: jest.fn().mockResolvedValue('Test User')
  }
}));

describe('PersonalizedGreeting Property Tests', () => {
  /**
   * Feature: enhanced-dashboard-features, Property 1: Time-based greeting format
   * For any time of day and user name, the greeting should display the appropriate 
   * time-based message with the user's name when available, or without the name when unavailable
   * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
   */
  test('Property 1: Time-based greeting format', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('morning', 'afternoon', 'evening'),
        fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
        (timeOfDay, userName) => {
          const { getByText } = render(
            <PersonalizedGreeting 
              timeOfDay={timeOfDay as 'morning' | 'afternoon' | 'evening'}
              userName={userName}
            />
          );

          // Expected greeting based on time of day
          const expectedGreetings = {
            morning: 'Good Morning',
            afternoon: 'Good Afternoon',
            evening: 'Good Evening'
          };

          const baseGreeting = expectedGreetings[timeOfDay];
          const expectedGreeting = userName ? `${baseGreeting} ${userName}` : baseGreeting;

          // Verify greeting is displayed correctly
          const greetingElement = getByText(expectedGreeting);
          expect(greetingElement).toBeTruthy();

          // Verify subtitle is always present
          const subtitleElement = getByText('Your Financial Command Center');
          expect(subtitleElement).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('TimeUtils correctly determines time of day', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }),
        (hour) => {
          // Mock Date to return specific hour
          const mockDate = new Date();
          mockDate.setHours(hour);
          jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

          const timeOfDay = TimeUtils.getTimeOfDay();

          if (hour >= 5 && hour < 12) {
            expect(timeOfDay).toBe('morning');
          } else if (hour >= 12 && hour < 17) {
            expect(timeOfDay).toBe('afternoon');
          } else {
            expect(timeOfDay).toBe('evening');
          }

          // Restore Date
          jest.restoreAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Greeting handles empty and null usernames gracefully', () => {
    const testCases = [null, undefined, '', '   '];
    
    testCases.forEach(userName => {
      const { getByText } = render(
        <PersonalizedGreeting 
          timeOfDay="morning"
          userName={userName}
        />
      );

      // Should display greeting without name
      const greetingElement = getByText('Good Morning');
      expect(greetingElement).toBeTruthy();
    });
  });

  test('Greeting displays correctly for all time periods', () => {
    const timeOfDayTests = [
      { timeOfDay: 'morning' as const, expected: 'Good Morning' },
      { timeOfDay: 'afternoon' as const, expected: 'Good Afternoon' },
      { timeOfDay: 'evening' as const, expected: 'Good Evening' }
    ];

    timeOfDayTests.forEach(({ timeOfDay, expected }) => {
      const { getByText } = render(
        <PersonalizedGreeting timeOfDay={timeOfDay} />
      );

      const greetingElement = getByText(expected);
      expect(greetingElement).toBeTruthy();
    });
  });

  test('Greeting with username displays correctly', () => {
    const testNames = ['John', 'Jane Doe', 'राम', 'محمد', 'José María'];
    
    testNames.forEach(name => {
      const { getByText } = render(
        <PersonalizedGreeting 
          timeOfDay="morning"
          userName={name}
        />
      );

      const expectedGreeting = `Good Morning ${name}`;
      const greetingElement = getByText(expectedGreeting);
      expect(greetingElement).toBeTruthy();
    });
  });
});